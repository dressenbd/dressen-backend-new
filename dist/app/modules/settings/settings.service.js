"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const settings_model_1 = require("./settings.model");
// ✅ Create Settings
const createSettingsOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield settings_model_1.SettingsModel.findOne();
    if (exist)
        throw new handleAppError_1.default(400, "Settings already exist. Please update instead.");
    const result = yield settings_model_1.SettingsModel.create(payload);
    return result;
});
// ✅ Get All Settings (Only one record)
const getSettingsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_model_1.SettingsModel.findOne();
    return result;
});
// ✅ Get Logo Only
const getLogoFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield settings_model_1.SettingsModel.findOne();
    if (!(settings === null || settings === void 0 ? void 0 : settings.logo))
        throw new handleAppError_1.default(404, "Logo not found!");
    return { logo: settings.logo };
});
// ✅ Get Slider Images Only
const getSliderImagesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const settings = yield settings_model_1.SettingsModel.findOne();
    if (!((_a = settings === null || settings === void 0 ? void 0 : settings.sliderImages) === null || _a === void 0 ? void 0 : _a.length))
        throw new handleAppError_1.default(404, "No slider images found!");
    return { sliderImages: settings.sliderImages };
});
// ✅ Get Contact and Social Info Only
const getContactAndSocialFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield settings_model_1.SettingsModel.findOne();
    if (!(settings === null || settings === void 0 ? void 0 : settings.contactAndSocial))
        throw new handleAppError_1.default(404, "Contact and social info not found!");
    return { contactAndSocial: settings.contactAndSocial };
});
// ✅ Get Mobile MFS Info Only
const getMobileMfsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield settings_model_1.SettingsModel.findOne();
    if (!(settings === null || settings === void 0 ? void 0 : settings.mobileMfs))
        throw new handleAppError_1.default(404, "Mobile MFS info not found!");
    return { mobileMfs: settings.mobileMfs };
});
// ✅ Get Delivery Charge Only (if exists)
const getDeliveryChargeFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield settings_model_1.SettingsModel.findOne();
    if (!(settings === null || settings === void 0 ? void 0 : settings.deliveryCharge) && (settings === null || settings === void 0 ? void 0 : settings.deliveryCharge) !== 0)
        throw new handleAppError_1.default(404, "Delivery charge not found!");
    return { deliveryCharge: settings.deliveryCharge };
});
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
const updateSettingsOnDB = (updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    const settings = yield settings_model_1.SettingsModel.findOne();
    if (!settings)
        throw new handleAppError_1.default(404, "Settings not found!");
    // ✅ ==== FIX FOR sliderImages START ====
    // This new logic correctly handles additions, deletions, and the 3-image limit.
    const newUploadedImages = updatedData.sliderImages || []; // From req.files
    const imagesToDelete = updatedData.deletedSliderImages || [];
    const currentImages = settings.sliderImages || [];
    // 1. Start with current images and remove any marked for deletion
    let imagesAfterDeletion = currentImages.filter((img) => !imagesToDelete.includes(img));
    // 2. Add the new images to the end of the list
    let combinedImages = [...imagesAfterDeletion, ...newUploadedImages];
    // 3. Enforce limit (max 3) by taking the *last* 3 items
    // This ensures newly uploaded images are prioritized.
    updatedData.sliderImages = combinedImages.slice(-3);
    // 4. Delete the specified images from Cloudinary
    if (imagesToDelete.length > 0) {
        yield Promise.all(imagesToDelete.map((img) => (0, cloudinary_config_1.deleteImageFromCLoudinary)(img)));
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
                bKashLogo: ((_a = updatedData.mobileMfs.bKash) === null || _a === void 0 ? void 0 : _a.bKashLogo) ||
                    ((_c = (_b = settings.mobileMfs) === null || _b === void 0 ? void 0 : _b.bKash) === null || _c === void 0 ? void 0 : _c.bKashLogo) ||
                    "",
                bKashNumber: ((_d = updatedData.mobileMfs.bKash) === null || _d === void 0 ? void 0 : _d.bKashNumber) !== undefined &&
                    ((_e = updatedData.mobileMfs.bKash) === null || _e === void 0 ? void 0 : _e.bKashNumber) !== ""
                    ? updatedData.mobileMfs.bKash.bKashNumber
                    : ((_g = (_f = settings.mobileMfs) === null || _f === void 0 ? void 0 : _f.bKash) === null || _g === void 0 ? void 0 : _g.bKashNumber) || "",
            },
            nagad: {
                nagadLogo: ((_h = updatedData.mobileMfs.nagad) === null || _h === void 0 ? void 0 : _h.nagadLogo) ||
                    ((_k = (_j = settings.mobileMfs) === null || _j === void 0 ? void 0 : _j.nagad) === null || _k === void 0 ? void 0 : _k.nagadLogo) ||
                    "",
                nagadNumber: ((_l = updatedData.mobileMfs.nagad) === null || _l === void 0 ? void 0 : _l.nagadNumber) !== undefined &&
                    ((_m = updatedData.mobileMfs.nagad) === null || _m === void 0 ? void 0 : _m.nagadNumber) !== ""
                    ? updatedData.mobileMfs.nagad.nagadNumber
                    : ((_p = (_o = settings.mobileMfs) === null || _o === void 0 ? void 0 : _o.nagad) === null || _p === void 0 ? void 0 : _p.nagadNumber) || "",
            },
            rocket: {
                rocketLogo: ((_q = updatedData.mobileMfs.rocket) === null || _q === void 0 ? void 0 : _q.rocketLogo) ||
                    ((_s = (_r = settings.mobileMfs) === null || _r === void 0 ? void 0 : _r.rocket) === null || _s === void 0 ? void 0 : _s.rocketLogo) ||
                    "",
                rocketNumber: ((_t = updatedData.mobileMfs.rocket) === null || _t === void 0 ? void 0 : _t.rocketNumber) !== undefined &&
                    ((_u = updatedData.mobileMfs.rocket) === null || _u === void 0 ? void 0 : _u.rocketNumber) !== ""
                    ? updatedData.mobileMfs.rocket.rocketNumber
                    : ((_w = (_v = settings.mobileMfs) === null || _v === void 0 ? void 0 : _v.rocket) === null || _w === void 0 ? void 0 : _w.rocketNumber) || "",
            },
            upay: {
                upayLogo: ((_x = updatedData.mobileMfs.upay) === null || _x === void 0 ? void 0 : _x.upayLogo) ||
                    ((_z = (_y = settings.mobileMfs) === null || _y === void 0 ? void 0 : _y.upay) === null || _z === void 0 ? void 0 : _z.upayLogo) ||
                    "",
                upayNumber: ((_0 = updatedData.mobileMfs.upay) === null || _0 === void 0 ? void 0 : _0.upayNumber) !== undefined &&
                    ((_1 = updatedData.mobileMfs.upay) === null || _1 === void 0 ? void 0 : _1.upayNumber) !== ""
                    ? updatedData.mobileMfs.upay.upayNumber
                    : ((_3 = (_2 = settings.mobileMfs) === null || _2 === void 0 ? void 0 : _2.upay) === null || _3 === void 0 ? void 0 : _3.upayNumber) || "",
            },
        };
    }
    // ✅ Deep merge for contactAndSocial (This logic is correct)
    if (updatedData.contactAndSocial) {
        updatedData.contactAndSocial = Object.assign(Object.assign({}, (settings.contactAndSocial || {})), (updatedData.contactAndSocial || {}));
    }
    // ✅ Update document
    const result = yield settings_model_1.SettingsModel.findOneAndUpdate({}, updatedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
// ✅ Update Mobile MFS Settings Only
const updateMfsSettingsOnDB = (updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = yield settings_model_1.SettingsModel.findOne();
    if (!settings)
        throw new handleAppError_1.default(404, "Settings not found!");
    const existingMfs = settings.mobileMfs || {};
    const newMfs = updatedData.mobileMfs || {};
    // ✅ Deep merge for each MFS provider
    const mergedMfs = {
        bKash: Object.assign(Object.assign({}, (existingMfs.bKash || {})), (newMfs.bKash || {})),
        nagad: Object.assign(Object.assign({}, (existingMfs.nagad || {})), (newMfs.nagad || {})),
        rocket: Object.assign(Object.assign({}, (existingMfs.rocket || {})), (newMfs.rocket || {})),
        upay: Object.assign(Object.assign({}, (existingMfs.upay || {})), (newMfs.upay || {})),
    };
    // ✅ Update only the mobileMfs subdocument using $set
    const result = yield settings_model_1.SettingsModel.findOneAndUpdate({}, { $set: { mobileMfs: mergedMfs } }, { new: true, runValidators: true });
    return result;
});
exports.settingsServices = {
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
