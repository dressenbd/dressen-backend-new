import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { settingsServices } from "./settings.service";

// ✅ Create Settings
const createSettings = catchAsync(async (req, res) => {
  const files =
    (req.files as { [fieldname: string]: Express.Multer.File[] }) || {};

  const logo = files["logo"] ? files["logo"][0].path : undefined;
  const sliderImages = files["sliderImages"]
    ? files["sliderImages"].map((f) => f.path)
    : [];
  const popupImage = files["popupImage"]
    ? files["popupImage"][0].path
    : undefined;

  const settingsData: any = {
    ...req.body,
    logo,
    sliderImages,
    popupImage,
  };

  // ✅ Handle MFS logos
  settingsData.mobileMfs = settingsData.mobileMfs || {};

  if (files?.bKashLogo?.length) {
    settingsData.mobileMfs.bKash = {
      ...(settingsData.mobileMfs.bKash || {}),
      bKashLogo: files.bKashLogo[0].path,
    };
  }
  if (files?.nagadLogo?.length) {
    settingsData.mobileMfs.nagad = {
      ...(settingsData.mobileMfs.nagad || {}),
      nagadLogo: files.nagadLogo[0].path,
    };
  }
  if (files?.rocketLogo?.length) {
    settingsData.mobileMfs.rocket = {
      ...(settingsData.mobileMfs.rocket || {}),
      rocketLogo: files.rocketLogo[0].path,
    };
  }
  if (files?.upayLogo?.length) {
    settingsData.mobileMfs.upay = {
      ...(settingsData.mobileMfs.upay || {}),
      upayLogo: files.upayLogo[0].path,
    };
  }

  const result = await settingsServices.createSettingsOnDB(settingsData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Settings created successfully!",
    data: result,
  });
});

// ✅ Get All Settings data
const getSettings = catchAsync(async (req, res) => {
  const result = await settingsServices.getSettingsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Settings retrieved successfully!",
    data: result,
  });
});

// ✅ Get Logo
export const getLogo = catchAsync(async (req, res) => {
  const result = await settingsServices.getLogoFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logo retrieved successfully!",
    data: result,
  });
});

// ✅ Get Slider Images
export const getSliderImages = catchAsync(async (req, res) => {
  const result = await settingsServices.getSliderImagesFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Slider images retrieved successfully!",
    data: result,
  });
});

// ✅ Get Contact & Social
export const getContactAndSocial = catchAsync(async (req, res) => {
  const result = await settingsServices.getContactAndSocialFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Contact & social info retrieved successfully!",
    data: result,
  });
});

// ✅ Get Mobile MFS
export const getMobileMfs = catchAsync(async (req, res) => {
  const result = await settingsServices.getMobileMfsFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Mobile MFS info retrieved successfully!",
    data: result,
  });
});

// ✅ Get Delivery Charge
export const getDeliveryCharge = catchAsync(async (req, res) => {
  const result = await settingsServices.getDeliveryChargeFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Delivery charge retrieved successfully!",
    data: result,
  });
});

// ✅ Update Settings

const updateSettings = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const updatedData: any = { ...req.body };

  // ✅ Main images
  if (files?.logo?.length) {
    updatedData.logo = files.logo[0].path;
  }
  if (files?.sliderImages?.length) {
    updatedData.sliderImages = files.sliderImages.map((f) => f.path);
  }
  if (files?.popupImage?.length) {
    updatedData.popupImage = files.popupImage[0].path;
  }

  // ✅ MFS logos
  updatedData.mobileMfs = updatedData.mobileMfs || {};

  if (files?.bKashLogo?.length) {
    updatedData.mobileMfs.bKash = {
      ...(updatedData.mobileMfs.bKash || {}),
      bKashLogo: files.bKashLogo[0].path,
    };
  }
  if (files?.nagadLogo?.length) {
    updatedData.mobileMfs.nagad = {
      ...(updatedData.mobileMfs.nagad || {}),
      nagadLogo: files.nagadLogo[0].path,
    };
  }
  if (files?.rocketLogo?.length) {
    updatedData.mobileMfs.rocket = {
      ...(updatedData.mobileMfs.rocket || {}),
      rocketLogo: files.rocketLogo[0].path,
    };
  }
  if (files?.upayLogo?.length) {
    updatedData.mobileMfs.upay = {
      ...(updatedData.mobileMfs.upay || {}),
      upayLogo: files.upayLogo[0].path,
    };
  }

  const result = await settingsServices.updateSettingsOnDB(updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Settings updated successfully!",
    data: result,
  });
});

const updateMfsSettings = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const updatedData: any = {};

  // ✅ Parse JSON body if sent as string (common in multipart/form-data)
  if (typeof req.body.mobileMfs === "string") {
    try {
      updatedData.mobileMfs = JSON.parse(req.body.mobileMfs);
    } catch (err) {
      console.error("Failed to parse mobileMfs JSON:", err);
      updatedData.mobileMfs = {};
    }
  } else {
    updatedData.mobileMfs = req.body.mobileMfs || {};
  }

  // ✅ Handle file uploads safely
  if (files?.bKashLogo?.length) {
    updatedData.mobileMfs.bKash = {
      ...(updatedData.mobileMfs.bKash || {}),
      bKashLogo: files.bKashLogo[0].path,
    };
  }

  if (files?.nagadLogo?.length) {
    updatedData.mobileMfs.nagad = {
      ...(updatedData.mobileMfs.nagad || {}),
      nagadLogo: files.nagadLogo[0].path,
    };
  }

  if (files?.rocketLogo?.length) {
    updatedData.mobileMfs.rocket = {
      ...(updatedData.mobileMfs.rocket || {}),
      rocketLogo: files.rocketLogo[0].path,
    };
  }

  if (files?.upayLogo?.length) {
    updatedData.mobileMfs.upay = {
      ...(updatedData.mobileMfs.upay || {}),
      upayLogo: files.upayLogo[0].path,
    };
  }

  // ✅ Call service
  const result = await settingsServices.updateMfsSettingsOnDB(updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Mobile MFS settings updated successfully!",
    data: result,
  });
});

export const settingsControllers = {
  createSettings,
  getSettings,
  updateSettings,
  updateMfsSettings,
  getLogo,
  getSliderImages,
  getContactAndSocial,
  getMobileMfs,
  getDeliveryCharge,
};
