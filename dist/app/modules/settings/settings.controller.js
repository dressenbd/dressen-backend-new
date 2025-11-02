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
exports.settingsControllers = exports.getDeliveryCharge = exports.getMobileMfs = exports.getContactAndSocial = exports.getSliderImages = exports.getLogo = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const settings_service_1 = require("./settings.service");
// ✅ Create Settings
const createSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const files = req.files || {};
    const logo = files["logo"] ? files["logo"][0].path : undefined;
    const sliderImages = files["sliderImages"]
        ? files["sliderImages"].map((f) => f.path)
        : [];
    const popupImage = files["popupImage"]
        ? files["popupImage"][0].path
        : undefined;
    const settingsData = Object.assign(Object.assign({}, req.body), { logo,
        sliderImages,
        popupImage });
    // ✅ Handle MFS logos
    settingsData.mobileMfs = settingsData.mobileMfs || {};
    if ((_a = files === null || files === void 0 ? void 0 : files.bKashLogo) === null || _a === void 0 ? void 0 : _a.length) {
        settingsData.mobileMfs.bKash = Object.assign(Object.assign({}, (settingsData.mobileMfs.bKash || {})), { bKashLogo: files.bKashLogo[0].path });
    }
    if ((_b = files === null || files === void 0 ? void 0 : files.nagadLogo) === null || _b === void 0 ? void 0 : _b.length) {
        settingsData.mobileMfs.nagad = Object.assign(Object.assign({}, (settingsData.mobileMfs.nagad || {})), { nagadLogo: files.nagadLogo[0].path });
    }
    if ((_c = files === null || files === void 0 ? void 0 : files.rocketLogo) === null || _c === void 0 ? void 0 : _c.length) {
        settingsData.mobileMfs.rocket = Object.assign(Object.assign({}, (settingsData.mobileMfs.rocket || {})), { rocketLogo: files.rocketLogo[0].path });
    }
    if ((_d = files === null || files === void 0 ? void 0 : files.upayLogo) === null || _d === void 0 ? void 0 : _d.length) {
        settingsData.mobileMfs.upay = Object.assign(Object.assign({}, (settingsData.mobileMfs.upay || {})), { upayLogo: files.upayLogo[0].path });
    }
    const result = yield settings_service_1.settingsServices.createSettingsOnDB(settingsData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Settings created successfully!",
        data: result,
    });
}));
// ✅ Get All Settings data
const getSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_service_1.settingsServices.getSettingsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Settings retrieved successfully!",
        data: result,
    });
}));
// ✅ Get Logo
exports.getLogo = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_service_1.settingsServices.getLogoFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Logo retrieved successfully!",
        data: result,
    });
}));
// ✅ Get Slider Images
exports.getSliderImages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_service_1.settingsServices.getSliderImagesFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Slider images retrieved successfully!",
        data: result,
    });
}));
// ✅ Get Contact & Social
exports.getContactAndSocial = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_service_1.settingsServices.getContactAndSocialFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Contact & social info retrieved successfully!",
        data: result,
    });
}));
// ✅ Get Mobile MFS
exports.getMobileMfs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_service_1.settingsServices.getMobileMfsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Mobile MFS info retrieved successfully!",
        data: result,
    });
}));
// ✅ Get Delivery Charge
exports.getDeliveryCharge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_service_1.settingsServices.getDeliveryChargeFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Delivery charge retrieved successfully!",
        data: result,
    });
}));
// ✅ Update Settings
const updateSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const files = req.files;
    const updatedData = Object.assign({}, req.body);
    // ✅ Main images
    if ((_a = files === null || files === void 0 ? void 0 : files.logo) === null || _a === void 0 ? void 0 : _a.length) {
        updatedData.logo = files.logo[0].path;
    }
    if ((_b = files === null || files === void 0 ? void 0 : files.sliderImages) === null || _b === void 0 ? void 0 : _b.length) {
        updatedData.sliderImages = files.sliderImages.map((f) => f.path);
    }
    if ((_c = files === null || files === void 0 ? void 0 : files.popupImage) === null || _c === void 0 ? void 0 : _c.length) {
        updatedData.popupImage = files.popupImage[0].path;
    }
    // ✅ MFS logos
    updatedData.mobileMfs = updatedData.mobileMfs || {};
    if ((_d = files === null || files === void 0 ? void 0 : files.bKashLogo) === null || _d === void 0 ? void 0 : _d.length) {
        updatedData.mobileMfs.bKash = Object.assign(Object.assign({}, (updatedData.mobileMfs.bKash || {})), { bKashLogo: files.bKashLogo[0].path });
    }
    if ((_e = files === null || files === void 0 ? void 0 : files.nagadLogo) === null || _e === void 0 ? void 0 : _e.length) {
        updatedData.mobileMfs.nagad = Object.assign(Object.assign({}, (updatedData.mobileMfs.nagad || {})), { nagadLogo: files.nagadLogo[0].path });
    }
    if ((_f = files === null || files === void 0 ? void 0 : files.rocketLogo) === null || _f === void 0 ? void 0 : _f.length) {
        updatedData.mobileMfs.rocket = Object.assign(Object.assign({}, (updatedData.mobileMfs.rocket || {})), { rocketLogo: files.rocketLogo[0].path });
    }
    if ((_g = files === null || files === void 0 ? void 0 : files.upayLogo) === null || _g === void 0 ? void 0 : _g.length) {
        updatedData.mobileMfs.upay = Object.assign(Object.assign({}, (updatedData.mobileMfs.upay || {})), { upayLogo: files.upayLogo[0].path });
    }
    const result = yield settings_service_1.settingsServices.updateSettingsOnDB(updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Settings updated successfully!",
        data: result,
    });
}));
const updateMfsSettings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const files = req.files;
    const updatedData = {};
    // ✅ Parse JSON body if sent as string (common in multipart/form-data)
    if (typeof req.body.mobileMfs === "string") {
        try {
            updatedData.mobileMfs = JSON.parse(req.body.mobileMfs);
        }
        catch (err) {
            console.error("Failed to parse mobileMfs JSON:", err);
            updatedData.mobileMfs = {};
        }
    }
    else {
        updatedData.mobileMfs = req.body.mobileMfs || {};
    }
    // ✅ Handle file uploads safely
    if ((_a = files === null || files === void 0 ? void 0 : files.bKashLogo) === null || _a === void 0 ? void 0 : _a.length) {
        updatedData.mobileMfs.bKash = Object.assign(Object.assign({}, (updatedData.mobileMfs.bKash || {})), { bKashLogo: files.bKashLogo[0].path });
    }
    if ((_b = files === null || files === void 0 ? void 0 : files.nagadLogo) === null || _b === void 0 ? void 0 : _b.length) {
        updatedData.mobileMfs.nagad = Object.assign(Object.assign({}, (updatedData.mobileMfs.nagad || {})), { nagadLogo: files.nagadLogo[0].path });
    }
    if ((_c = files === null || files === void 0 ? void 0 : files.rocketLogo) === null || _c === void 0 ? void 0 : _c.length) {
        updatedData.mobileMfs.rocket = Object.assign(Object.assign({}, (updatedData.mobileMfs.rocket || {})), { rocketLogo: files.rocketLogo[0].path });
    }
    if ((_d = files === null || files === void 0 ? void 0 : files.upayLogo) === null || _d === void 0 ? void 0 : _d.length) {
        updatedData.mobileMfs.upay = Object.assign(Object.assign({}, (updatedData.mobileMfs.upay || {})), { upayLogo: files.upayLogo[0].path });
    }
    // ✅ Call service
    const result = yield settings_service_1.settingsServices.updateMfsSettingsOnDB(updatedData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Mobile MFS settings updated successfully!",
        data: result,
    });
}));
exports.settingsControllers = {
    createSettings,
    getSettings,
    updateSettings,
    updateMfsSettings,
    getLogo: exports.getLogo,
    getSliderImages: exports.getSliderImages,
    getContactAndSocial: exports.getContactAndSocial,
    getMobileMfs: exports.getMobileMfs,
    getDeliveryCharge: exports.getDeliveryCharge,
};
