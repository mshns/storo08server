import mongoose, { Schema } from 'mongoose';

const playerSchema = new Schema({
  username: { type: String, required: true },
  points: { type: Number, required: true },
});

const boardSchema = new Schema(
  {
    month: { type: String, required: true },
    type: { type: String, required: true, enum: ['base', 'daily'] },
    players: { type: [playerSchema], default: [] },
    processedDays: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
);

const leaderboardDB = mongoose.connection.useDb('leaderboard');
const Board = leaderboardDB.model('Board', boardSchema, 'boards');

export default Board;
