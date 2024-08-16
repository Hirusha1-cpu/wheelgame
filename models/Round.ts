// models/Round.ts
import { Timestamp } from "mongodb";
import mongoose, { Document, Model, Schema } from "mongoose";

interface IPlayer {
  address: string;
  entries: number;
}

interface IRound extends Document {
  roundNumber: string;
  players: IPlayer[];
  startTimeStamp: number;
}

const PlayerSchema: Schema = new Schema({
  address: { type: String, required: true },
  entries: { type: Number, required: true },
});

const RoundSchema: Schema = new Schema({
  roundNumber: { type: String, required: true, unique: true },
  players: [PlayerSchema],
  startTimeStamp: { type: Number, required: true },
});

const Round: Model<IRound> =
  mongoose.models.Round || mongoose.model<IRound>("Round", RoundSchema);

export default Round;
