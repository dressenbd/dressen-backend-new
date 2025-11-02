"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.steadfastRoutes = void 0;
const express_1 = __importDefault(require("express"));
const steadfast_controller_1 = require("./steadfast.controller");
const router = express_1.default.Router();
router.post("/create-order", steadfast_controller_1.createOrderController);
router.post("/bulk-order", steadfast_controller_1.bulkCreateOrderController);
router.get("/status/invoice/:invoice", steadfast_controller_1.getStatusByInvoiceController);
router.get("/status/consignment/:id", steadfast_controller_1.getStatusByConsignmentIdController);
router.get("/status/tracking/:trackingCode", steadfast_controller_1.getStatusByTrackingCodeController);
router.get("/balance", steadfast_controller_1.getCurrentBalanceController);
router.post("/return-request", steadfast_controller_1.createReturnRequestController);
router.get("/return-request/:id", steadfast_controller_1.getReturnRequestController);
router.get("/return-requests", steadfast_controller_1.getReturnRequestsController);
exports.steadfastRoutes = router;
