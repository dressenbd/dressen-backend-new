"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathaoRoutes = void 0;
const express_1 = __importDefault(require("express"));
// import validateRequest from "../../middlewares/validateRequest";
const pathao_controller_1 = require("./pathao.controller");
// import {
//   createStoreSchema,
//   createOrderSchema,
//   bulkOrderSchema,
//   calculatePriceSchema,
// } from "./pathao.validation";
// import auth from "../../middlewares/auth"; // Uncomment when auth is ready
const router = express_1.default.Router();
// Token management (admin only)
router.post("/issue-token", 
// auth("admin", "super-admin"),
pathao_controller_1.issueTokenController);
router.post("/refresh-token", 
// auth("admin", "super-admin"),
pathao_controller_1.refreshTokenController);
// Store management (admin only)
router.post("/create-store", 
// auth("admin", "super-admin"),
// validateRequest(createStoreSchema),
pathao_controller_1.createStoreController);
router.get("/stores", 
// auth("admin", "super-admin"),
pathao_controller_1.getStoreListController);
// Order management (admin only)
router.post("/create-order", 
// auth("admin", "super-admin"),
// validateRequest(createOrderSchema),
pathao_controller_1.createOrderController);
router.post("/bulk-order", 
// auth("admin", "super-admin"),
// validateRequest(bulkOrderSchema),
pathao_controller_1.bulkCreateOrdersController);
// Order tracking routes
router.get("/order/:consignmentId", pathao_controller_1.getOrderInfoController);
router.get("/order-info/:consignmentId", pathao_controller_1.getOrderInfoController);
router.get("/track/:consignmentId", pathao_controller_1.getOrderInfoController);
router.get("/tracking/:consignmentId", pathao_controller_1.getOrderInfoController);
// Location services (admin only)
router.get("/cities", 
// auth("admin", "super-admin"),
pathao_controller_1.getCityListController);
router.get("/cities/:cityId/zones", 
// auth("admin", "super-admin"),
pathao_controller_1.getZoneListController);
router.get("/zones/:zoneId/areas", 
// auth("admin", "super-admin"),
pathao_controller_1.getAreaListController);
// Pricing (admin only)
router.post("/calculate-price", 
// auth("admin", "super-admin"),
// validateRequest(calculatePriceSchema),
pathao_controller_1.calculatePriceController);
// Admin automation routes
router.post("/auto-create/:orderId", pathao_controller_1.autoCreatePathaoOrderController);
router.get("/sync-status/:orderId", pathao_controller_1.syncOrderStatusController);
router.post("/delivery-cost", pathao_controller_1.getDeliveryCostController);
exports.pathaoRoutes = router;
