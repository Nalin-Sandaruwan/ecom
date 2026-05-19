import mongoose, { Schema, Document } from "mongoose";

export enum ProductType {
  PRODUCE = "produce",
  SEEDS = "seeds",
  FERTILIZERS = "fertilizers",
  EQUIPMENT = "equipment",
  OTHER = "other",
}

export interface IProduct extends Document {
  productName: string;
  productDescription: string;
  price: number;
  quantity: number;
  imageURIs: string[];
  certificateURIs?: string[];
  productType: ProductType;
  farmerId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    productName: { type: String, required: true },
    productDescription: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    imageURIs: {
      type: [String],
      validate: [
        (val: string[]) => val.length <= 2,
        "{PATH} exceeds the limit of 2 images",
      ],
      default: [],
    },
    certificateURIs: {
      type: [String],
      default: [],
    },
    productType: {
      type: String,
      enum: Object.values(ProductType),
      required: true,
      default: ProductType.PRODUCE,
    },
    farmerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
