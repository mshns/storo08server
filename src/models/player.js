import mongoose, { Schema } from 'mongoose';

const playerSchema = new Schema({
  login: { type: String, required: true },
  nickname: { type: String, required: true },
});

const leaderboardDB = mongoose.connection.useDb('leaderboard');
const Player = leaderboardDB.model('Player', playerSchema, 'players');

export default Player;
