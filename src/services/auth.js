import bcrypt from 'bcrypt';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import User from '../db/models/User.js';
import Session from '../db/models/Session.js';

const ACCESS_TTL = 1000 * 60 * 15;
const REFRESH_TTL = 1000 * 60 * 60 * 24 * 30;

export const registerUser = async (data) => {
  if (!data) {
    throw createHttpError(400, 'Request body is missing');
  }

  const { name, email, password } = data;

  if (!name || !email || !password) {
    throw createHttpError(400, 'Missing required fields');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw createHttpError(400, 'Email and password required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw createHttpError(401, 'Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createHttpError(401, 'Invalid credentials');

  await Session.deleteMany({ userId: user._id });

  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TTL),
  });
};

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, 'No refresh token');

  const session = await Session.findOne({ refreshToken });
  if (!session) throw createHttpError(401, 'Invalid refresh token');

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  const user = await User.findById(session.userId);
  if (!user) throw createHttpError(401);

  await Session.deleteOne({ _id: session._id });

  const accessToken = crypto.randomUUID();
  const newRefreshToken = crypto.randomUUID();

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TTL),
  });
};

export const logoutSession = async (refreshToken) => {
  if (!refreshToken) return;
  await Session.deleteOne({ refreshToken });
};
