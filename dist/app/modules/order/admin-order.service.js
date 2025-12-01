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
exports.adminOrderServices = void 0;
const nanoid_1 = require("nanoid");
const mongoose_1 = require("mongoose");
const order_model_1 = require("./order.model");
const product_model_1 = require("../product/product.model");
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const createAdminOrderIntoDB = (payload, adminUser) => __awaiter(void 0, void 0, void 0, function* () {
    // Set admin as order creator
    payload.orderBy = adminUser._id;
    payload.userRole = "admin";
    // Generate tracking number
    payload.trackingNumber = `ADM-${(0, nanoid_1.nanoid)(8)}`;
    // Set default status based on source
    if (!payload.status) {
        payload.status = payload.orderSource === "walk-in" ? "paid" : "pending";
    }
    // Calculate totals
    let totalQuantity = 0;
    let calculatedTotal = 0;
    payload.orderInfo.forEach((item) => {
        totalQuantity += item.quantity || 0;
        calculatedTotal += item.totalAmount.total || 0;
        // Set default shipping if not provided
        if (!item.totalAmount.shipping) {
            item.totalAmount.shipping = {
                name: "Standard",
                type: "free"
            };
        }
        // Admin commission calculation (if SR is assigned)
        if (payload.assignedSR && item.commission) {
            if (item.commission.type === "percentage") {
                item.commission.amount = (item.totalAmount.total * item.commission.value) / 100;
            }
            else {
                item.commission.amount = item.commission.value;
            }
        }
    });
    payload.totalQuantity = totalQuantity;
    payload.totalAmount = calculatedTotal;
    // Add admin metadata
    payload.adminMetadata = {
        createdBy: adminUser._id,
        orderSource: payload.orderSource,
        adminNotes: payload.adminNotes,
        customerType: payload.customerType || "guest",
        assignedSR: payload.assignedSR ? new mongoose_1.Types.ObjectId(payload.assignedSR) : undefined,
    };
    const result = yield order_model_1.OrderModel.create(payload);
    // If walk-in order (immediate payment), update stock
    if (payload.orderSource === "walk-in" && payload.status === "paid") {
        yield updateProductStock(payload.orderInfo, "deduct");
    }
    return result;
});
const createBulkOrdersIntoDB = (orders, adminUser) => __awaiter(void 0, void 0, void 0, function* () {
    const results = {
        successful: 0,
        failed: 0,
        errors: [],
        orders: []
    };
    for (const orderData of orders) {
        try {
            const result = yield createAdminOrderIntoDB(orderData, adminUser);
            results.successful++;
            results.orders.push(result);
        }
        catch (error) {
            results.failed++;
            results.errors.push(`Order ${orderData.customerInfo.fullName}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    return results;
});
// Helper function to update product stock
const updateProductStock = (orderInfo, action) => __awaiter(void 0, void 0, void 0, function* () {
    for (const item of orderInfo) {
        const product = yield product_model_1.ProductModel.findById(item.productInfo);
        if (product && product.productInfo) {
            const orderQty = item.quantity || 0;
            const currentQty = product.productInfo.quantity || 0;
            let newQty;
            if (action === "deduct") {
                if (currentQty < orderQty) {
                    throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Not enough stock for product. Only ${currentQty} left.`);
                }
                newQty = currentQty - orderQty;
            }
            else {
                newQty = currentQty + orderQty;
            }
            yield product_model_1.ProductModel.findByIdAndUpdate(item.productInfo, {
                "productInfo.quantity": newQty,
            });
        }
    }
});
exports.adminOrderServices = {
    createAdminOrderIntoDB,
    createBulkOrdersIntoDB,
};
