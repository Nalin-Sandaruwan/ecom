import mongoose, { Schema, Document } from "mongoose";

export interface IFarmerProfile extends Document {
  farmName: string;
  description: string;
  address: string;
  rating: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FarmerProfileSchema: Schema = new Schema(
  {
    farmName: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    rating: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFarmerProfile>("FarmerProfile", FarmerProfileSchema);
