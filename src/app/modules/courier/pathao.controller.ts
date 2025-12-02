import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as pathaoService from "./pathao.service";

// 🔹 Issue Token
export const issueTokenController = catchAsync(async (req, res) => {
  const result = await pathaoService.issueToken();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Pathao access token issued successfully!",
    data: result,
  });
});

// 🔹 Refresh Token
export const refreshTokenController = catchAsync(async (req, res) => {
  const result = await pathaoService.refreshAccessToken();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Pathao access token refreshed successfully!",
    data: result,
  });
});

// 🔹 Create Store
export const createStoreController = catchAsync(async (req, res) => {
  const storeData = req.body.storeData || req.body;
  
  // Clean empty fields
  if (storeData.secondary_contact === '') delete storeData.secondary_contact;
  if (storeData.otp_number === '') delete storeData.otp_number;
  
  const result = await pathaoService.createStore(storeData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Pathao store created successfully!",
    data: result,
  });
});

// 🔹 Create Order
export const createOrderController = catchAsync(async (req, res) => {
  const orderData = req.body.orderData || req.body;
  
  // Validate required fields
  const errors = [];
  if (!orderData.store_id || orderData.store_id === 0) errors.push('store_id is required');
  if (!orderData.recipient_name || orderData.recipient_name === '') errors.push('recipient_name is required');
  if (!orderData.recipient_phone || orderData.recipient_phone === '') errors.push('recipient_phone is required');
  if (!orderData.recipient_address || orderData.recipient_address === '') errors.push('recipient_address is required');
  
  if (errors.length > 0) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: "Validation failed: " + errors.join(', '),
      data: null,
    });
  }
  
  // Clean empty optional fields
  if (orderData.item_description === '') delete orderData.item_description;
  if (orderData.special_instruction === '') delete orderData.special_instruction;
  if (orderData.merchant_order_id === '') delete orderData.merchant_order_id;
  
  const result = await pathaoService.createOrder(orderData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Pathao order created successfully!",
    data: result,
  });
});

// 🔹 Bulk Create Orders
export const bulkCreateOrdersController = catchAsync(async (req, res) => {
  const result = await pathaoService.bulkCreateOrders(req.body.orders);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.ACCEPTED,
    message: "Pathao bulk orders created successfully!",
    data: result,
  });
});

// 🔹 Get Order Info
export const getOrderInfoController = catchAsync(async (req, res) => {
  const result = await pathaoService.getOrderInfo(req.params.consignmentId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order info retrieved successfully!",
    data: result,
  });
});

// 🔹 Get City List
export const getCityListController = catchAsync(async (req, res) => {
  const result = await pathaoService.getCityList();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "City list retrieved successfully!",
    data: result,
  });
});

// 🔹 Get Zone List
export const getZoneListController = catchAsync(async (req, res) => {
  const result = await pathaoService.getZoneList(Number(req.params.cityId));
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Zone list retrieved successfully!",
    data: result,
  });
});

// 🔹 Get Area List
export const getAreaListController = catchAsync(async (req, res) => {
  const result = await pathaoService.getAreaList(Number(req.params.zoneId));
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Area list retrieved successfully!",
    data: result,
  });
});

// 🔹 Calculate Price
export const calculatePriceController = catchAsync(async (req, res) => {
  const result = await pathaoService.calculatePrice(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Price calculated successfully!",
    data: result,
  });
});

// 🔹 Get Store List
export const getStoreListController = catchAsync(async (req, res) => {
  const result = await pathaoService.getStoreList();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Store list retrieved successfully!",
    data: result,
  });
});

// 🔹 Auto Create Pathao Order
export const autoCreatePathaoOrderController = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const pathaoAdminService = await import('./pathao.admin.service');
  const result = await pathaoAdminService.autoCreatePathaoOrder(orderId);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: result ? "Pathao order created automatically!" : "Order not eligible for Pathao delivery",
    data: result,
  });
});

// 🔹 Sync Order Status
export const syncOrderStatusController = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const pathaoAdminService = await import('./pathao.admin.service');
  const result = await pathaoAdminService.syncPathaoOrderStatus(orderId);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order status synced successfully!",
    data: result,
  });
});

// 🔹 Get Delivery Cost
export const getDeliveryCostController = catchAsync(async (req, res) => {
  const pathaoAdminService = await import('./pathao.admin.service');
  const result = await pathaoAdminService.getDeliveryCost(req.body);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Delivery cost calculated successfully!",
    data: result,
  });
});
