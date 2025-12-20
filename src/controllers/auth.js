import { registerUser, loginUser, refreshSession, logoutSession } from '../services/auth.js';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';
import createHttpError from 'http-errors';
import User from '../db/models/User.js';

//register
export const registerController = async (req, res, next) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

//login
export const loginController = async (req, res, next) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

//refresh
export const refreshController = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  const session = await refreshSession(refreshToken);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

//logout
export const logoutController = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  await logoutSession(refreshToken);

  res.clearCookie('refreshToken');

  res.status(204).send();
};

//send reset email
export const sendResetEmailController = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }   

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  console.log('RESET PASSWORD TOKEN:', token);

  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  try {
    await sendEmail({
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 5 minutes.</p>`,
    });

  } catch (error) {
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent',
    data: {},
  });
}

//reset password
export const resetPasswordController = async (req, res, next) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw createHttpError(401, 'Token is invalid or expired');
  }

  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  user.password = password;
  await user.save();

  res.status(200).json({
    status: 200,
    message: 'Password has been reset successfully',
    data: {},
  });
};
