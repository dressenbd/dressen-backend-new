import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { adminOrderControllers } from "./admin-order.controller";
import { 
  createAdminOrderZodSchema, 
  createBulkOrdersZodSchema,
  quickOrderZodSchema 
} from "./admin-order.validation";
// import auth from "../../middlewares/auth"; // Uncomment when auth middleware is available

const router = express.Router();

// Create single admin order
router.post(
  "/create",
  // auth("admin", "admin-staff"), // Uncomment when auth is available
  validateRequest(createAdminOrderZodSchema),
  adminOrderControllers.createAdminOrder
);

// Create bulk orders
router.post(
  "/bulk-create",
  // auth("admin", "admin-staff"),
  validateRequest(createBulkOrdersZodSchema),
  adminOrderControllers.createBulkOrders
);

// Quick order for walk-in customers
router.post(
  "/quick-order",
  // auth("admin", "admin-staff"),
  validateRequest(quickOrderZodSchema),
  adminOrderControllers.createAdminOrder
);

export const AdminOrderRoutes = router;