import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/handleAppError";
import { TSettings } from "./settings.interface";
import { SettingsModel } from "./settings.model";

// ✅ Create Settings
const createSettingsOnDB = async (payload: TSettings) => {
  const exist = await SettingsModel.findOne();
  if (exist)
    throw new AppError(400, "Settings already exist. Please update instead.");
  const result = await SettingsModel.create(payload);
  return result;
};

// ✅ Get All Settings (Only one record)
const getSettingsFromDB = async () => {
  const result = await SettingsModel.findOne();
  return result;
};

// ✅ Get Logo Only
const getLogoFromDB = async () => {
  const settings = await SettingsModel.findOne();
  if (!settings?.logo) throw new AppError(404, "Logo not found!");
  return { logo: settings.logo };
};

// ✅ Get Slider Images Only
const getSliderImagesFromDB = async () => {
  const settings = await SettingsModel.findOne();
  if (!settings?.sliderImages?.length)
    throw new AppError(404, "No slider images found!");
  return { sliderImages: settings.sliderImages };
};

// ✅ Get Contact and Social Info Only
const getContactAndSocialFromDB = async () => {
  const settings = await SettingsModel.findOne();
  if (!settings?.contactAndSocial)
    throw new AppError(404, "Contact and social info not found!");
  return { contactAndSocial: settings.contactAndSocial };
};

// ✅ Get Mobile MFS Info Only
const getMobileMfsFromDB = async () => {
  const settings = await SettingsModel.findOne();
  if (!settings?.mobileMfs)
    throw new AppError(404, "Mobile MFS info not found!");
  return { mobileMfs: settings.mobileMfs };
};

// ✅ Get Delivery Charge Only (if exists)
const getDeliveryChargeFromDB = async () => {
  const settings = await SettingsModel.findOne();
  if (!settings?.deliveryCharge && settings?.deliveryCharge !== 0)
    throw new AppError(404, "Delivery charge not found!");
  return { deliveryCharge: settings.deliveryCharge };
};

// ✅ Update Settings

// const updateSettingsOnDB = async (updatedData: Partial<TSettings>) => {
//   const settings = await SettingsModel.findOne();
//   if (!settings) throw new AppError(404, "Settings not found!");

//   // ✅ handle image deletions (same as before)
//   if (
//     (updatedData as any).deletedSliderImages?.length > 0 &&
//     settings.sliderImages?.length
//   ) {
//     const restImages = settings.sliderImages.filter(
//       (img) => !(updatedData as any).deletedSliderImages?.includes(img)
//     );
//     const updatedSliderImages = (updatedData.sliderImages || [])
//       .filter((img) => !(updatedData as any).deletedSliderImages?.includes(img))
//       .filter((img) => !restImages.includes(img));

//     updatedData.sliderImages = [...restImages, ...updatedSliderImages];

//     await Promise.all(
//       (updatedData as any).deletedSliderImages.map((img: string) =>
//         deleteImageFromCLoudinary(img)
//       )
//     );
//   }

//   // ✅ Deep merge for mobileMfs
//   if (updatedData.mobileMfs) {
//     updatedData.mobileMfs = {
//       bKash: {
//         ...(settings.mobileMfs?.bKash || {}),
//         ...(updatedData.mobileMfs.bKash || {}),
//       },
//       nagad: {
//         ...(settings.mobileMfs?.nagad || {}),
//         ...(updatedData.mobileMfs.nagad || {}),
//       },
//       rocket: {
//         ...(settings.mobileMfs?.rocket || {}),
//         ...(updatedData.mobileMfs.rocket || {}),
//       },
//       upay: {
//         ...(settings.mobileMfs?.upay || {}),
//         ...(updatedData.mobileMfs.upay || {}),
//       },
//     };
//   }

//   // ✅ Deep merge for contactAndSocial if needed
//   if (updatedData.contactAndSocial) {
//     updatedData.contactAndSocial = {
//       ...(settings.contactAndSocial || {}),
//       ...(updatedData.contactAndSocial || {}),
//     };
//   }

//   // ✅ Update document
//   const result = await SettingsModel.findOneAndUpdate({}, updatedData, {
//     new: true,
//     runValidators: true,
//   });

//   return result;
// };

// const updateSettingsOnDB = async (updatedData: Partial<TSettings>) => {
//   const settings = await SettingsModel.findOne();
//   if (!settings) throw new AppError(404, "Settings not found!");

//   // ✅ Handle slider image updates intelligently
//   if (updatedData.sliderImages?.length) {
//     // Append new images to the old ones (keep max 3)
//     const oldImages = settings.sliderImages || [];
//     const newImages = updatedData.sliderImages;

//     // Remove duplicates and limit to 3
//     const mergedImages = Array.from(
//       new Set([...oldImages, ...newImages])
//     ).slice(0, 3);

//     updatedData.sliderImages = mergedImages;
//   } else {
//     // Keep existing ones if not provided
//     updatedData.sliderImages = settings.sliderImages;
//   }

//   // ✅ Handle deletedSliderImages if any
//   if ((updatedData as any).deletedSliderImages?.length > 0) {
//     updatedData.sliderImages = settings.sliderImages?.filter(
//       (img) => !(updatedData as any).deletedSliderImages.includes(img)
//     );

//     // Delete from Cloudinary
//     await Promise.all(
//       (updatedData as any).deletedSliderImages.map((img: string) =>
//         deleteImageFromCLoudinary(img)
//       )
//     );
//   }

//   // ✅ Deep merge for mobileMfs
//   if (updatedData.mobileMfs) {
//     updatedData.mobileMfs = {
//       bKash: {
//         ...(settings.mobileMfs?.bKash || {}),
//         ...(updatedData.mobileMfs.bKash || {}),
//       },
//       nagad: {
//         ...(settings.mobileMfs?.nagad || {}),
//         ...(updatedData.mobileMfs.nagad || {}),
//       },
//       rocket: {
//         ...(settings.mobileMfs?.rocket || {}),
//         ...(updatedData.mobileMfs.rocket || {}),
//       },
//       upay: {
//         ...(settings.mobileMfs?.upay || {}),
//         ...(updatedData.mobileMfs.upay || {}),
//       },
//     };
//   }

//   // ✅ Deep merge for contactAndSocial
//   if (updatedData.contactAndSocial) {
//     updatedData.contactAndSocial = {
//       ...(settings.contactAndSocial || {}),
//       ...(updatedData.contactAndSocial || {}),
//     };
//   }

//   // ✅ Update document
//   const result = await SettingsModel.findOneAndUpdate({}, updatedData, {
//     new: true,
//     runValidators: true,
//   });

//   return result;
// };

// ✅ Update Settings
const updateSettingsOnDB = async (
  updatedData: Partial<TSettings> & { deletedSliderImages?: string[] }
) => {
  const settings = await SettingsModel.findOne();
  if (!settings) throw new AppError(404, "Settings not found!");

  // ✅ ==== FIX FOR sliderImages START ====
  // This new logic correctly handles additions, deletions, and the 3-image limit.

  const newUploadedImages = updatedData.sliderImages || []; // From req.files
  const imagesToDelete = updatedData.deletedSliderImages || [];
  const currentImages = settings.sliderImages || [];

  // 1. Start with current images and remove any marked for deletion
  let imagesAfterDeletion = currentImages.filter(
    (img) => !imagesToDelete.includes(img)
  );

  // 2. Add the new images to the end of the list
  let combinedImages = [...imagesAfterDeletion, ...newUploadedImages];

  // 3. Enforce limit (max 3) by taking the *last* 3 items
  // This ensures newly uploaded images are prioritized.
  updatedData.sliderImages = combinedImages.slice(-3);

  // 4. Delete the specified images from Cloudinary
  if (imagesToDelete.length > 0) {
    await Promise.all(
      imagesToDelete.map((img: string) => deleteImageFromCLoudinary(img))
    );
  }
  // ✅ ==== FIX FOR sliderImages END ====

  // ✅ Deep merge for mobileMfs (This logic is correct)
  // if (updatedData.mobileMfs) {
  //   updatedData.mobileMfs = {
  //     bKash: {
  //       ...(settings.mobileMfs?.bKash || {}),
  //       ...(updatedData.mobileMfs.bKash || {}),
  //     },
  //     nagad: {
  //       ...(settings.mobileMfs?.nagad || {}),
  //       ...(updatedData.mobileMfs.nagad || {}),
  //     },
  //     rocket: {
  //       ...(settings.mobileMfs?.rocket || {}),
  //       ...(updatedData.mobileMfs.rocket || {}),
  //     },
  //     upay: {
  //       ...(settings.mobileMfs?.upay || {}),
  //       ...(updatedData.mobileMfs.upay || {}),
  //     },
  //   };
  // }

  if (updatedData.mobileMfs) {
    updatedData.mobileMfs = {
      bKash: {
        bKashLogo:
          updatedData.mobileMfs.bKash?.bKashLogo ||
          settings.mobileMfs?.bKash?.bKashLogo ||
          "",
        bKashNumber:
          updatedData.mobileMfs.bKash?.bKashNumber !== undefined &&
          updatedData.mobileMfs.bKash?.bKashNumber !== ""
            ? updatedData.mobileMfs.bKash.bKashNumber
            : settings.mobileMfs?.bKash?.bKashNumber || "",
      },
      nagad: {
        nagadLogo:
          updatedData.mobileMfs.nagad?.nagadLogo ||
          settings.mobileMfs?.nagad?.nagadLogo ||
          "",
        nagadNumber:
          updatedData.mobileMfs.nagad?.nagadNumber !== undefined &&
          updatedData.mobileMfs.nagad?.nagadNumber !== ""
            ? updatedData.mobileMfs.nagad.nagadNumber
            : settings.mobileMfs?.nagad?.nagadNumber || "",
      },
      rocket: {
        rocketLogo:
          updatedData.mobileMfs.rocket?.rocketLogo ||
          settings.mobileMfs?.rocket?.rocketLogo ||
          "",
        rocketNumber:
          updatedData.mobileMfs.rocket?.rocketNumber !== undefined &&
          updatedData.mobileMfs.rocket?.rocketNumber !== ""
            ? updatedData.mobileMfs.rocket.rocketNumber
            : settings.mobileMfs?.rocket?.rocketNumber || "",
      },
      upay: {
        upayLogo:
          updatedData.mobileMfs.upay?.upayLogo ||
          settings.mobileMfs?.upay?.upayLogo ||
          "",
        upayNumber:
          updatedData.mobileMfs.upay?.upayNumber !== undefined &&
          updatedData.mobileMfs.upay?.upayNumber !== ""
            ? updatedData.mobileMfs.upay.upayNumber
            : settings.mobileMfs?.upay?.upayNumber || "",
      },
    };
  }

  // ✅ Deep merge for contactAndSocial (This logic is correct)
  if (updatedData.contactAndSocial) {
    updatedData.contactAndSocial = {
      ...(settings.contactAndSocial || {}),
      ...(updatedData.contactAndSocial || {}),
    };
  }

  // ✅ Update document
  const result = await SettingsModel.findOneAndUpdate({}, updatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

// ✅ Update Mobile MFS Settings Only

const updateMfsSettingsOnDB = async (updatedData: any) => {
  const settings = await SettingsModel.findOne();
  if (!settings) throw new AppError(404, "Settings not found!");

  const existingMfs = settings.mobileMfs || {};
  const newMfs = updatedData.mobileMfs || {};

  // ✅ Deep merge for each MFS provider
  const mergedMfs = {
    bKash: {
      ...(existingMfs.bKash || {}),
      ...(newMfs.bKash || {}),
    },
    nagad: {
      ...(existingMfs.nagad || {}),
      ...(newMfs.nagad || {}),
    },
    rocket: {
      ...(existingMfs.rocket || {}),
      ...(newMfs.rocket || {}),
    },
    upay: {
      ...(existingMfs.upay || {}),
      ...(newMfs.upay || {}),
    },
  };

  // ✅ Update only the mobileMfs subdocument using $set
  const result = await SettingsModel.findOneAndUpdate(
    {},
    { $set: { mobileMfs: mergedMfs } },
    { new: true, runValidators: true }
  );

  return result;
};
export const settingsServices = {
  createSettingsOnDB,
  getSettingsFromDB,
  getLogoFromDB,
  getSliderImagesFromDB,
  getContactAndSocialFromDB,
  getMobileMfsFromDB,
  getDeliveryChargeFromDB,
  updateSettingsOnDB,
  updateMfsSettingsOnDB,
};
