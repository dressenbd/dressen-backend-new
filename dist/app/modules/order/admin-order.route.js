"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_order_controller_1 = require("./admin-order.controller");
const admin_order_validation_1 = require("./admin-order.validation");
// import auth from "../../middlewares/auth"; // Uncomment when auth middleware is available
const router = express_1.default.Router();
// Create single admin order
router.post("/create", 
// auth("admin", "admin-staff"), // Uncomment when auth is available
(0, validateRequest_1.default)(admin_order_validation_1.createAdminOrderZodSchema), admin_order_controller_1.adminOrderControllers.createAdminOrder);
// Create bulk orders
router.post("/bulk-create", 
// auth("admin", "admin-staff"),
(0, validateRequest_1.default)(admin_order_validation_1.createBulkOrdersZodSchema), admin_order_controller_1.adminOrderControllers.createBulkOrders);
// Quick order for walk-in customers
router.post("/quick-order", 
// auth("admin", "admin-staff"),
(0, validateRequest_1.default)(admin_order_validation_1.quickOrderZodSchema), admin_order_controller_1.adminOrderControllers.createAdminOrder);
exports.AdminOrderRoutes = router;
