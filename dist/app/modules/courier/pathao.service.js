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
exports.getStoreList = exports.calculatePrice = exports.getAreaList = exports.getZoneList = exports.getCityList = exports.getOrderInfo = exports.bulkCreateOrders = exports.createOrder = exports.createStore = exports.refreshAccessToken = exports.issueToken = void 0;
const axios_1 = __importDefault(require("axios"));
const pathao_config_1 = require("../../config/pathao.config");
const tokenService = __importStar(require("./pathao.token.service"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const http_status_1 = __importDefault(require("http-status"));
const client = axios_1.default.create({
    baseURL: pathao_config_1.pathaoConfig.baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});
// ✅ 1️⃣ Issue Access Token
const issueToken = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { data } = yield client.post("/issue-token", {
            client_id: pathao_config_1.pathaoConfig.clientId,
            client_secret: pathao_config_1.pathaoConfig.clientSecret,
            grant_type: "password",
            username: pathao_config_1.pathaoConfig.username,
            password: pathao_config_1.pathaoConfig.password,
        });
        yield tokenService.saveTokens(data.access_token, data.refresh_token, data.expires_in);
        return data;
    }
    catch (error) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Pathao token issue failed: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message}`);
    }
});
exports.issueToken = issueToken;
// ✅ 2️⃣ Refresh Access Token
const refreshAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const refreshToken = yield tokenService.getRefreshToken();
        if (!refreshToken) {
            throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "No refresh token available");
        }
        const { data } = yield client.post("/issue-token", {
            client_id: pathao_config_1.pathaoConfig.clientId,
            client_secret: pathao_config_1.pathaoConfig.clientSecret,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        });
        yield tokenService.saveTokens(data.access_token, data.refresh_token, data.expires_in);
        return data;
    }
    catch (error) {
        yield tokenService.clearTokens();
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, `Token refresh failed: ${((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message}`);
    }
});
exports.refreshAccessToken = refreshAccessToken;
// Helper to get valid token
const getValidToken = () => __awaiter(void 0, void 0, void 0, function* () {
    let token = yield tokenService.getAccessToken();
    if (!token) {
        yield (0, exports.issueToken)();
        token = yield tokenService.getAccessToken();
        if (!token) {
            throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, 'Failed to generate access token');
        }
    }
    return token;
});
// ✅ 3️⃣ Create Store
const createStore = (storeData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const token = yield getValidToken();
        const { data } = yield client.post("/stores", storeData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            yield (0, exports.refreshAccessToken)();
            const token = yield getValidToken();
            const { data } = yield client.post("/stores", storeData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        const errorMsg = ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.errors) ?
            JSON.stringify(error.response.data.errors) :
            ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || error.message;
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Store creation failed: ${errorMsg}`);
    }
});
exports.createStore = createStore;
// ✅ 4️⃣ Create Order
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const token = yield getValidToken();
        const { data } = yield client.post("/orders", orderData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            yield (0, exports.refreshAccessToken)();
            const token = yield getValidToken();
            const { data } = yield client.post("/orders", orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Order creation failed: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
    }
});
exports.createOrder = createOrder;
// ✅ 5️⃣ Create Bulk Order (Fixed: Individual requests)
const bulkCreateOrders = (orders) => __awaiter(void 0, void 0, void 0, function* () {
    const results = {
        successful: 0,
        failed: 0,
        orders: [],
        errors: []
    };
    for (const orderData of orders) {
        try {
            const result = yield (0, exports.createOrder)(orderData);
            results.successful++;
            results.orders.push(result);
        }
        catch (error) {
            results.failed++;
            results.errors.push(`Order failed: ${error.message}`);
        }
    }
    return results;
});
exports.bulkCreateOrders = bulkCreateOrders;
// ✅ 6️⃣ Get Order Info (Fixed endpoint)
const getOrderInfo = (consignmentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const token = yield getValidToken();
        const { data } = yield client.get(`/orders/${consignmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            yield (0, exports.refreshAccessToken)();
            const token = yield getValidToken();
            const { data } = yield client.get(`/orders/${consignmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Order info fetch failed: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
    }
});
exports.getOrderInfo = getOrderInfo;
// ✅ 7️⃣ Get City List
const getCityList = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const token = yield getValidToken();
        const { data } = yield client.get("/city-list", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            yield (0, exports.refreshAccessToken)();
            const token = yield getValidToken();
            const { data } = yield client.get("/city-list", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `City list fetch failed: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
    }
});
exports.getCityList = getCityList;
// ✅ 8️⃣ Get Zone List
const getZoneList = (cityId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const token = yield getValidToken();
        const { data } = yield client.get(`/cities/${cityId}/zone-list`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            yield (0, exports.refreshAccessToken)();
            const token = yield getValidToken();
            const { data } = yield client.get(`/cities/${cityId}/zone-list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Zone list fetch failed: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
    }
});
exports.getZoneList = getZoneList;
// ✅ 9️⃣ Get Area List
const getAreaList = (zoneId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const token = yield getValidToken();
        const { data } = yield client.get(`/zones/${zoneId}/area-list`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            yield (0, exports.refreshAccessToken)();
            const token = yield getValidToken();
            const { data } = yield client.get(`/zones/${zoneId}/area-list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Area list fetch failed: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
    }
});
exports.getAreaList = getAreaList;
// ✅ 🔟 Price Calculation
const calculatePrice = (priceData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const token = yield getValidToken();
        const { data } = yield client.post("/merchant/price-plan", priceData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            yield (0, exports.refreshAccessToken)();
            const token = yield getValidToken();
            const { data } = yield client.post("/merchant/price-plan", priceData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Price calculation failed: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
    }
});
exports.calculatePrice = calculatePrice;
// ✅ 1️⃣1️⃣ Get Store List
const getStoreList = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const token = yield getValidToken();
        const { data } = yield client.get("/stores", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
            yield (0, exports.refreshAccessToken)();
            const token = yield getValidToken();
            const { data } = yield client.get("/stores", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return data;
        }
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, `Store list fetch failed: ${((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message}`);
    }
});
exports.getStoreList = getStoreList;
