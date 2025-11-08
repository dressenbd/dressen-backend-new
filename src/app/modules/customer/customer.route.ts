import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { customerControllers } from "./customer.controller";
import {
  createCustomerZodSchema,
  updateCustomerZodSchema,
  addToWishlistZodSchema,
  removeFromWishlistZodSchema,
} from "./customer.validations";

const router = express.Router();

router.get("/", customerControllers.getAllCustomer);

router.get("/:id", customerControllers.getSingleCustomer);

router.get("/my-info/:id", customerControllers.getMyCustomerInfo);

router.post(
  "/create-customer",
  validateRequest(createCustomerZodSchema),
  customerControllers.createCustomer
);

router.patch(
  "/update-customer/:id",
  validateRequest(updateCustomerZodSchema),
  customerControllers.updateCustomer
);

// Wishlist routes
router.get("/wishlist/:userId", customerControllers.getWishlist);
router.post(
  "/wishlist/add/:userId",
  validateRequest(addToWishlistZodSchema),
  customerControllers.addToWishlist
);
router.delete(
  "/wishlist/remove/:userId",
  validateRequest(removeFromWishlistZodSchema),
  customerControllers.removeFromWishlist
);
router.delete("/wishlist/clear/:userId", customerControllers.clearWishlist);

export const CustomerRoutes = router;
