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
exports.getReturnRequests = exports.getReturnRequest = exports.createReturnRequest = exports.getCurrentBalance = exports.getStatusByTrackingCode = exports.getStatusByInvoice = exports.getStatusByConsignmentId = exports.bulkCreateOrders = exports.createOrder = void 0;
const axios_1 = __importDefault(require("axios"));
const steadfast_config_1 = require("../../config/steadfast.config");
const client = axios_1.default.create({
    baseURL: steadfast_config_1.steadfastConfig.baseURL,
    headers: {
        "Api-Key": steadfast_config_1.steadfastConfig.apiKey,
        "Secret-Key": steadfast_config_1.steadfastConfig.secretKey,
        "Content-Type": "application/json",
    },
});
// ✅ 1️⃣ Create single order
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield client.post("/create_order", orderData);
    return data;
});
exports.createOrder = createOrder;
// ✅ 2️⃣ Bulk order creation (max 500)
const bulkCreateOrders = (orders) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = { data: orders };
    const { data } = yield client.post("/create_order/bulk-order", payload);
    return data;
});
exports.bulkCreateOrders = bulkCreateOrders;
// ✅ 3️⃣ Check delivery status (by consignment ID)
const getStatusByConsignmentId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield client.get(`/status_by_cid/${id}`);
    return data;
});
exports.getStatusByConsignmentId = getStatusByConsignmentId;
// ✅ 4️⃣ Check delivery status (by invoice)
const getStatusByInvoice = (invoice) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield client.get(`/status_by_invoice/${invoice}`);
    return data;
});
exports.getStatusByInvoice = getStatusByInvoice;
// ✅ 5️⃣ Check delivery status (by tracking code)
const getStatusByTrackingCode = (trackingCode) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield client.get(`/status_by_trackingcode/${trackingCode}`);
    return data;
});
exports.getStatusByTrackingCode = getStatusByTrackingCode;
// ✅ 6️⃣ Get current balance
const getCurrentBalance = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield client.get("/get_balance");
    return data;
});
exports.getCurrentBalance = getCurrentBalance;
// ✅ 7️⃣ Create return request
const createReturnRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield client.post("/create_return_request", payload);
    return data;
});
exports.createReturnRequest = createReturnRequest;
// ✅ 8️⃣ Get single return request
const getReturnRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield client.get(`/get_return_request/${id}`);
    return data;
});
exports.getReturnRequest = getReturnRequest;
// ✅ 9️⃣ Get all return requests
const getReturnRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield client.get("/get_return_requests");
    return data;
});
exports.getReturnRequests = getReturnRequests;
