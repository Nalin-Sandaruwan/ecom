import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  review: string;
  rating: number;
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  },
  { timestamps: true }
);

// Allow user to review the same product if purchased in different orders
ReviewSchema.index({ productId: 1, userId: 1, orderId: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", ReviewSchema);
