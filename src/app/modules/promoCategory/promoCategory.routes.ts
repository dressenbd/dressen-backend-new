import express from "express";
import { multerUpload } from "../../config/multer.config";
import { promoCategoryControllers } from "./promoCategory.controller";

const router = express.Router();

router.post("/", multerUpload.single("image"), promoCategoryControllers.createPromoCategory);
router.get("/", promoCategoryControllers.getAllPromoCategories);
router.get("/active", promoCategoryControllers.getActivePromoCategories);
router.get("/:id", promoCategoryControllers.getPromoCategoryById);
router.patch("/:id", multerUpload.single("image"), promoCategoryControllers.updatePromoCategory);
router.delete("/:id", promoCategoryControllers.deletePromoCategory);

export const promoCategoryRoutes = router;
