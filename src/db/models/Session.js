import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
  accessToken: String,
  refreshToken: String,
  accessTokenValidUntil: Date,
  refreshTokenValidUntil: Date,
});
const Session = mongoose.model('Session', sessionSchema);

export default Session;
