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
exports.getDeliveryCost = exports.syncPathaoOrderStatus = exports.autoCreatePathaoOrder = void 0;
const pathaoService = __importStar(require("./pathao.service"));
const order_model_1 = require("../order/order.model");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
// Auto-create Pathao order when main order is confirmed
const autoCreatePathaoOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.OrderModel.findById(orderId).populate('customerInfo');
    if (!order) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    // Check if order is eligible for Pathao delivery
    if (order.pathaoConsignmentId) {
        return null;
    }
    const pathaoOrderData = {
        store_id: 1, // Default store ID - should be configurable
        merchant_order_id: order.trackingNumber,
        recipient_name: order.customerInfo.fullName,
        recipient_phone: order.customerInfo.phoneNumber || order.customerInfo.phone,
        recipient_address: order.customerInfo.address,
        delivery_type: 48, // Normal delivery
        item_type: 2, // Parcel
        item_quantity: order.totalQuantity,
        item_weight: calculateOrderWeight(order),
        item_description: `Order ${order.trackingNumber}`,
        amount_to_collect: order.totalAmount,
    };
    try {
        const result = yield pathaoService.createOrder(pathaoOrderData);
        // Update order with Pathao consignment ID
        yield order_model_1.OrderModel.findByIdAndUpdate(orderId, {
            $set: {
                pathaoConsignmentId: result.data.consignment_id,
                courierService: 'pathao',
            }
        });
        return result;
    }
    catch (error) {
        console.error('Auto Pathao order creation failed:', error);
        return null;
    }
});
exports.autoCreatePathaoOrder = autoCreatePathaoOrder;
// Calculate order weight (default 0.5kg per item)
const calculateOrderWeight = (order) => {
    return Math.max(0.5, order.totalQuantity * 0.5);
};
// Sync Pathao order status with main order
const syncPathaoOrderStatus = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.OrderModel.findById(orderId);
    if (!order) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, 'Order not found');
    }
    const pathaoConsignmentId = order.pathaoConsignmentId;
    if (!pathaoConsignmentId) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'No Pathao consignment ID found');
    }
    try {
        const pathaoOrder = yield pathaoService.getOrderInfo(pathaoConsignmentId);
        // Map Pathao status to our order status
        const statusMapping = {
            'Pickup_Request_Placed': 'processing',
            'Picked_Up': 'shipped',
            'In_Transit': 'shipped',
            'Delivered': 'delivered',
            'Cancelled': 'cancelled',
            'Returned': 'returned',
        };
        const newStatus = statusMapping[pathaoOrder.data.status] || order.status;
        if (newStatus !== order.status) {
            yield order_model_1.OrderModel.findByIdAndUpdate(orderId, { status: newStatus });
        }
        return pathaoOrder;
    }
    catch (error) {
        console.error('Pathao status sync failed:', error);
        throw error;
    }
});
exports.syncPathaoOrderStatus = syncPathaoOrderStatus;
// Get delivery cost for order
const getDeliveryCost = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!orderData) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, 'Order data is required');
    }
    const priceData = {
        store_id: 1, // Default store ID
        item_type: 2,
        delivery_type: 48,
        item_weight: calculateOrderWeight(orderData),
        recipient_city: orderData.cityId || 1,
        recipient_zone: orderData.zoneId || 298,
    };
    return yield pathaoService.calculatePrice(priceData);
});
exports.getDeliveryCost = getDeliveryCost;
