"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getDeliveryCostController = exports.syncOrderStatusController = exports.autoCreatePathaoOrderController = exports.getStoreListController = exports.calculatePriceController = exports.getAreaListController = exports.getZoneListController = exports.getCityListController = exports.getOrderInfoController = exports.bulkCreateOrdersController = exports.createOrderController = exports.createStoreController = exports.refreshTokenController = exports.issueTokenController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const pathaoService = __importStar(require("./pathao.service"));
// 🔹 Issue Token
exports.issueTokenController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pathaoService.issueToken();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Pathao access token issued successfully!",
        data: result,
    });
}));
// 🔹 Refresh Token
exports.refreshTokenController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pathaoService.refreshAccessToken();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Pathao access token refreshed successfully!",
        data: result,
    });
}));
// 🔹 Create Store
exports.createStoreController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const storeData = req.body.storeData || req.body;
    // Clean empty fields
    if (storeData.secondary_contact === '')
        delete storeData.secondary_contact;
    if (storeData.otp_number === '')
        delete storeData.otp_number;
    const result = yield pathaoService.createStore(storeData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Pathao store created successfully!",
        data: result,
    });
}));
// 🔹 Create Order
exports.createOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderData = req.body.orderData || req.body;
    // Validate required fields
    const errors = [];
    if (!orderData.store_id || orderData.store_id === 0)
        errors.push('store_id is required');
    if (!orderData.recipient_name || orderData.recipient_name === '')
        errors.push('recipient_name is required');
    if (!orderData.recipient_phone || orderData.recipient_phone === '')
        errors.push('recipient_phone is required');
    if (!orderData.recipient_address || orderData.recipient_address === '')
        errors.push('recipient_address is required');
    if (errors.length > 0) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_1.default.BAD_REQUEST,
            message: "Validation failed: " + errors.join(', '),
            data: null,
        });
    }
    // Clean empty optional fields
    if (orderData.item_description === '')
        delete orderData.item_description;
    if (orderData.special_instruction === '')
        delete orderData.special_instruction;
    if (orderData.merchant_order_id === '')
        delete orderData.merchant_order_id;
    const result = yield pathaoService.createOrder(orderData);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Pathao order created successfully!",
        data: result,
    });
}));
// 🔹 Bulk Create Orders
exports.bulkCreateOrdersController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pathaoService.bulkCreateOrders(req.body.orders);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.ACCEPTED,
        message: "Pathao bulk orders created successfully!",
        data: result,
    });
}));
// 🔹 Get Order Info
exports.getOrderInfoController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pathaoService.getOrderInfo(req.params.consignmentId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order info retrieved successfully!",
        data: result,
    });
}));
// 🔹 Get City List
exports.getCityListController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pathaoService.getCityList();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "City list retrieved successfully!",
        data: result,
    });
}));
// 🔹 Get Zone List
exports.getZoneListController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pathaoService.getZoneList(Number(req.params.cityId));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Zone list retrieved successfully!",
        data: result,
    });
}));
// 🔹 Get Area List
exports.getAreaListController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pathaoService.getAreaList(Number(req.params.zoneId));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Area list retrieved successfully!",
        data: result,
    });
}));
// 🔹 Calculate Price
exports.calculatePriceController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pathaoService.calculatePrice(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Price calculated successfully!",
        data: result,
    });
}));
// 🔹 Get Store List
exports.getStoreListController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pathaoService.getStoreList();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Store list retrieved successfully!",
        data: result,
    });
}));
// 🔹 Auto Create Pathao Order
exports.autoCreatePathaoOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const pathaoAdminService = yield Promise.resolve().then(() => __importStar(require('./pathao.admin.service')));
    const result = yield pathaoAdminService.autoCreatePathaoOrder(orderId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: result ? "Pathao order created automatically!" : "Order not eligible for Pathao delivery",
        data: result,
    });
}));
// 🔹 Sync Order Status
exports.syncOrderStatusController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const pathaoAdminService = yield Promise.resolve().then(() => __importStar(require('./pathao.admin.service')));
    const result = yield pathaoAdminService.syncPathaoOrderStatus(orderId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Order status synced successfully!",
        data: result,
    });
}));
// 🔹 Get Delivery Cost
exports.getDeliveryCostController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pathaoAdminService = yield Promise.resolve().then(() => __importStar(require('./pathao.admin.service')));
    const result = yield pathaoAdminService.getDeliveryCost(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Delivery cost calculated successfully!",
        data: result,
    });
}));
