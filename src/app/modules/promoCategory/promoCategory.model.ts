import { model, Schema } from "mongoose";
import { TPromoCategory } from "./promoCategory.interface";

const promoCategorySchema = new Schema<TPromoCategory>(
  {
    name: {
      type: String,
      required: [true, "Promo category name is required!"],
      unique: true,
    },
    slug: { type: String },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export const PromoCategoryModel = model<TPromoCategory>("PromoCategory", promoCategorySchema);
