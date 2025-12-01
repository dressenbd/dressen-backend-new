"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const promoCategory_controller_1 = require("./promoCategory.controller");
const router = express_1.default.Router();
router.post("/", multer_config_1.multerUpload.single("image"), promoCategory_controller_1.promoCategoryControllers.createPromoCategory);
router.get("/", promoCategory_controller_1.promoCategoryControllers.getAllPromoCategories);
router.get("/active", promoCategory_controller_1.promoCategoryControllers.getActivePromoCategories);
router.get("/:id", promoCategory_controller_1.promoCategoryControllers.getPromoCategoryById);
router.patch("/:id", multer_config_1.multerUpload.single("image"), promoCategory_controller_1.promoCategoryControllers.updatePromoCategory);
router.delete("/:id", promoCategory_controller_1.promoCategoryControllers.deletePromoCategory);
exports.promoCategoryRoutes = router;
