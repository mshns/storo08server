import mongoose, { Schema } from 'mongoose';

const playerSchema = new Schema({
  username: { type: String, required: true },
  points: { type: Number, required: true },
});

const chaseBoardSchema = new Schema(
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

const chaseDB = mongoose.connection.useDb('chase');
const chaseBoard = chaseDB.model('chaseBoard', chaseBoardSchema, 'boards');

export default chaseBoard;
