import express from "express";
import { multerUpload } from "../../config/multer.config";
import { settingsControllers } from "./settings.controller";

const router = express.Router();

// Upload fields
const uploadFields = multerUpload.fields([
  { name: "logo", maxCount: 1 },
  { name: "popupImage", maxCount: 1 },
  { name: "sliderImages", maxCount: 3 },
  { name: "bKashLogo", maxCount: 1 },
  { name: "nagadLogo", maxCount: 1 },
  { name: "rocketLogo", maxCount: 1 },
  { name: "upayLogo", maxCount: 1 },
]);

router.get("/", settingsControllers.getSettings);
router.get("/logo", settingsControllers.getLogo);
router.get("/slider-images", settingsControllers.getSliderImages);
router.get("/contact-and-social", settingsControllers.getContactAndSocial);
router.get("/mobile-mfs", settingsControllers.getMobileMfs);
router.get("/delivery-charge", settingsControllers.getDeliveryCharge);
router.post("/", uploadFields, settingsControllers.createSettings);
router.patch("/", uploadFields, settingsControllers.updateSettings);
// PATCH: update only MFS logos and numbers
router.patch(
  "/mfs-update",
  multerUpload.fields([
    { name: "bKashLogo", maxCount: 1 },
    { name: "nagadLogo", maxCount: 1 },
    { name: "rocketLogo", maxCount: 1 },
    { name: "upayLogo", maxCount: 1 },
  ]),
  settingsControllers.updateMfsSettings
);

export const settingsRoutes = router;
