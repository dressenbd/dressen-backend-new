"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const settings_controller_1 = require("./settings.controller");
const router = express_1.default.Router();
// Upload fields
const uploadFields = multer_config_1.multerUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "popupImage", maxCount: 1 },
    { name: "sliderImages", maxCount: 3 },
    { name: "bKashLogo", maxCount: 1 },
    { name: "nagadLogo", maxCount: 1 },
    { name: "rocketLogo", maxCount: 1 },
    { name: "upayLogo", maxCount: 1 },
]);
router.get("/", settings_controller_1.settingsControllers.getSettings);
router.get("/logo", settings_controller_1.settingsControllers.getLogo);
router.get("/slider-images", settings_controller_1.settingsControllers.getSliderImages);
router.get("/contact-and-social", settings_controller_1.settingsControllers.getContactAndSocial);
router.get("/mobile-mfs", settings_controller_1.settingsControllers.getMobileMfs);
router.get("/delivery-charge", settings_controller_1.settingsControllers.getDeliveryCharge);
router.post("/", uploadFields, settings_controller_1.settingsControllers.createSettings);
router.patch("/", uploadFields, settings_controller_1.settingsControllers.updateSettings);
// PATCH: update only MFS logos and numbers
router.patch("/mfs-update", multer_config_1.multerUpload.fields([
    { name: "bKashLogo", maxCount: 1 },
    { name: "nagadLogo", maxCount: 1 },
    { name: "rocketLogo", maxCount: 1 },
    { name: "upayLogo", maxCount: 1 },
]), settings_controller_1.settingsControllers.updateMfsSettings);
exports.settingsRoutes = router;
