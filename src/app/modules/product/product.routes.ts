import express from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { productControllers } from "./product.controller";
import {
  createProductZodSchema,
  updateProductZodSchema,
} from "./product.validations";

const router = express.Router();

router.get("/", productControllers.getAllProduct);

router.get("/products/by", productControllers.getProductsByCategoryandTag);

router.get("/discount", productControllers.getProductsByDiscount);

router.get("/promo-products", productControllers.getAllPromoProducts);

router.get("/promo-category/:promoCategoryId", productControllers.getProductsByPromoCategory);

router.get("/:id", productControllers.getSingleProduct);

router.post(
  "/create-product",
  multerUpload.fields([
    { name: "galleryImagesFiles", maxCount: 20 },
    { name: "featuredImgFile", maxCount: 1 },
  ]),
  validateRequest(createProductZodSchema),
  productControllers.createProduct
);

router.patch(
  "/update-product/:id",
  multerUpload.fields([
    { name: "galleryImagesFiles", maxCount: 20 },
    { name: "featuredImgFile", maxCount: 1 },
  ]),
  validateRequest(updateProductZodSchema),
  productControllers.updateProduct
);

router.delete("/delete-product/:id", productControllers.deleteProduct);

router.get("/inventory/stats", productControllers.inventoryStats);
export const ProductRoutes = router;
