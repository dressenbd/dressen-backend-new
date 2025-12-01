import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminOrderServices } from "./admin-order.service";

// Create order from different sources (phone, walk-in, online)
const createAdminOrder = catchAsync(async (req, res) => {
  const adminUser = req.user || { _id: "507f1f77bcf86cd799439011" }; // Valid ObjectId for testing
  const orderData = req.body;

  const result = await adminOrderServices.createAdminOrderIntoDB(orderData, adminUser);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Admin order created successfully!",
    data: result,
  });
});

// Bulk order creation for multiple customers
const createBulkOrders = catchAsync(async (req, res) => {
  const adminUser = req.user || { _id: "507f1f77bcf86cd799439011" }; // Valid ObjectId for testing
  const { orders } = req.body;

  const result = await adminOrderServices.createBulkOrdersIntoDB(orders, adminUser);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: `${result.successful} orders created successfully, ${result.failed} failed`,
    data: result,
  });
});

export const adminOrderControllers = {
  createAdminOrder,
  createBulkOrders,
};