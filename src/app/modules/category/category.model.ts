import { model, Schema } from "mongoose";
import { TCategory } from "./category.interface";

const iconSchema = new Schema(
  {
    name: { type: String },
    url: { type: String },
  },
  { _id: false } // Prevents creating a separate _id for icon
);

const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: [true, "Category can't create without a name!"],
    },
    slug: {
      type: String,
    },
    details: {
      type: String,
      required: [true, "Category need a description!"],
    },
    icon: iconSchema,
    image: {
      type: String,
      // required: [true, "An image is required to create category!"],
    },
    bannerImg: {
      type: String,
      required: [true, "A banner image is required to create category!"],
    },
    subCategories: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const CategoryModel = model<TCategory>("category", categorySchema);