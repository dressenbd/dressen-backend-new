import express from "express";
// import validateRequest from "../../middlewares/validateRequest";
import {
  bulkCreateOrdersController,
  calculatePriceController,
  createOrderController,
  createStoreController,
  getAreaListController,
  getCityListController,
  getOrderInfoController,
  getStoreListController,
  getZoneListController,
  issueTokenController,
  refreshTokenController,
  autoCreatePathaoOrderController,
  syncOrderStatusController,
  getDeliveryCostController,
} from "./pathao.controller";
// import {
//   createStoreSchema,
//   createOrderSchema,
//   bulkOrderSchema,
//   calculatePriceSchema,
// } from "./pathao.validation";
// import auth from "../../middlewares/auth"; // Uncomment when auth is ready

const router = express.Router();

// Token management (admin only)
router.post("/issue-token", 
  // auth("admin", "super-admin"),
  issueTokenController
);


router.post("/refresh-token", 
  // auth("admin", "super-admin"),
  refreshTokenController
);

// Store management (admin only)
router.post("/create-store", 
  // auth("admin", "super-admin"),
  // validateRequest(createStoreSchema),
  createStoreController
);
router.get("/stores", 
  // auth("admin", "super-admin"),
  getStoreListController
);

// Order management (admin only)
router.post("/create-order", 
  // auth("admin", "super-admin"),
  // validateRequest(createOrderSchema),
  createOrderController
);
router.post("/bulk-order", 
  // auth("admin", "super-admin"),
  // validateRequest(bulkOrderSchema),
  bulkCreateOrdersController
);
// Order tracking routes
router.get("/order/:consignmentId", getOrderInfoController);
router.get("/order-info/:consignmentId", getOrderInfoController);
router.get("/track/:consignmentId", getOrderInfoController);
router.get("/tracking/:consignmentId", getOrderInfoController);

// Location services (admin only)
router.get("/cities", 
  // auth("admin", "super-admin"),
  getCityListController
);
router.get("/cities/:cityId/zones", 
  // auth("admin", "super-admin"),
  getZoneListController
);
router.get("/zones/:zoneId/areas", 
  // auth("admin", "super-admin"),
  getAreaListController
);

// Pricing (admin only)
router.post("/calculate-price", 
  // auth("admin", "super-admin"),
  // validateRequest(calculatePriceSchema),
  calculatePriceController
);

// Admin automation routes
router.post("/auto-create/:orderId", autoCreatePathaoOrderController);
router.get("/sync-status/:orderId", syncOrderStatusController);
router.post("/delivery-cost", getDeliveryCostController);

export const pathaoRoutes = router;
