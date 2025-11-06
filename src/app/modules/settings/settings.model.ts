import { Schema, model } from "mongoose";
import { TSettings, TSliderImage } from "./settings.interface";

const bKashSchema = new Schema(
  {
    bKashLogo: { type: String },
    bKashNumber: { type: String },
  },
  { _id: false }
);

const nagadSchema = new Schema(
  {
    nagadLogo: { type: String },
    nagadNumber: { type: String },
  },
  { _id: false }
);

const rocketSchema = new Schema(
  {
    rocketLogo: { type: String },
    rocketNumber: { type: String },
  },
  { _id: false }
);

const upaySchema = new Schema(
  {
    upayLogo: { type: String },
    upayNumber: { type: String },
  },
  { _id: false }
);

const sliderImageSchema = new Schema<TSliderImage>(
  {
    image: { type: String, required: true },
    url: { type: String },
  },
  { _id: false }
);

const settingsSchema = new Schema<TSettings>(
  {
    enableHomepagePopup: { type: Boolean, default: false },
    popupTitle: { type: String },
    popupDescription: { type: String },
    popupDelay: { type: Number, default: 2000 },
    popupImage: { type: String },

    logo: { type: String },
    sliderImages: {
      type: [sliderImageSchema],
      validate: [
        (val: TSliderImage[]) => val.length <= 4,
        "Maximum 4 slider images allowed",
      ],
    },

    privacyPolicy: {
      title: { type: String },
      description: { type: String },
    },
    returnPolicy: {
      title: { type: String },
      description: { type: String },
    },

    mobileMfs: {
      bKash: bKashSchema,
      nagad: nagadSchema,
      rocket: rocketSchema,
      upay: upaySchema,
    },

    deliveryCharge: { type: Number, default: 0 },

    contactAndSocial: {
      address: { type: String },
      email: { type: String },
      phone: { type: String },
      facebookUrl: { type: [String] },
      instagramUrl: { type: [String] },
      youtubeUrl: { type: [String] },
      whatsappLink: { type: [String] },
    },
  },
  { timestamps: true }
);

export const SettingsModel = model<TSettings>("Settings", settingsSchema);
