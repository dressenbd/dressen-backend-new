import express from "express";
import {
  bulkCreateOrderController,
  createOrderController,
  createReturnRequestController,
  getCurrentBalanceController,
  getReturnRequestController,
  getReturnRequestsController,
  getStatusByConsignmentIdController,
  getStatusByInvoiceController,
  getStatusByTrackingCodeController,
} from "./steadfast.controller";

const router = express.Router();

router.post("/create-order", createOrderController);
router.post("/bulk-order", bulkCreateOrderController);

router.get("/status/invoice/:invoice", getStatusByInvoiceController);
router.get("/status/consignment/:id", getStatusByConsignmentIdController);
router.get("/status/tracking/:trackingCode", getStatusByTrackingCodeController);

router.get("/balance", getCurrentBalanceController);

router.post("/return-request", createReturnRequestController);
router.get("/return-request/:id", getReturnRequestController);
router.get("/return-requests", getReturnRequestsController);

export const steadfastRoutes = router;
