"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_order_service_1 = require("./admin-order.service");
// Create order from different sources (phone, walk-in, online)
const createAdminOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = req.user || { _id: "507f1f77bcf86cd799439011" }; // Valid ObjectId for testing
    const orderData = req.body;
    const result = yield admin_order_service_1.adminOrderServices.createAdminOrderIntoDB(orderData, adminUser);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Admin order created successfully!",
        data: result,
    });
}));
// Bulk order creation for multiple customers
const createBulkOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminUser = req.user || { _id: "507f1f77bcf86cd799439011" }; // Valid ObjectId for testing
    const { orders } = req.body;
    const result = yield admin_order_service_1.adminOrderServices.createBulkOrdersIntoDB(orders, adminUser);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: `${result.successful} orders created successfully, ${result.failed} failed`,
        data: result,
    });
}));
exports.adminOrderControllers = {
    createAdminOrder,
    createBulkOrders,
};
