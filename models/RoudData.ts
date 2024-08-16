// models/Round.ts
import mongoose, { Document, Model, Schema } from "mongoose";

interface IRoundData extends Document {
  currentRoundNumber: string;
  key: string;
}

const RoundDataSchema: Schema = new Schema({
  key: { type: String, required: true },
  currentRoundNumber: { type: String, required: true },
});

const RoundData: Model<IRoundData> =
  mongoose.models.RoundData ||
  mongoose.model<IRoundData>("RoundData", RoundDataSchema);

export default RoundData;
