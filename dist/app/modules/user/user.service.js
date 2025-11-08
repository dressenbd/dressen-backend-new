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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const order_model_1 = require("../order/order.model");
const vendor_consts_1 = require("../vendor/vendor.consts");
const user_const_1 = require("./user.const");
const user_model_1 = require("./user.model");
// const getAllUserFromDB = async () => {
//   const result = await UserModel.find();
//   return result;
// };
const getAllUserFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Step 1: Build query with filters, search, sort, pagination
    const userQuery = new QueryBuilder_1.default(user_model_1.UserModel.find(), query)
        .search(user_const_1.UserSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    // ✅ Step 2: Execute main query
    const users = yield userQuery.modelQuery;
    // ✅ Step 3: Compute total count for pagination
    const meta = yield userQuery.countTotal();
    // ✅ Step 4: Collect SR user IDs
    const srIds = users.filter((u) => u.role === "sr").map((u) => u._id);
    // ✅ Step 5: Aggregate to count total paid orders for SR users
    let paidOrderMap = new Map();
    if (srIds.length > 0) {
        const orderCounts = yield order_model_1.OrderModel.aggregate([
            {
                $match: {
                    status: "paid",
                    userRole: "sr",
                    orderBy: { $in: srIds },
                },
            },
            {
                $group: {
                    _id: "$orderBy",
                    totalPaidOrders: { $sum: 1 },
                },
            },
        ]);
        paidOrderMap = new Map(orderCounts.map((item) => [item._id.toString(), item.totalPaidOrders]));
    }
    // ✅ Step 6: Attach totalPaidOrders field to SR users
    const usersWithOrders = users.map((user) => {
        if (user.role === "sr") {
            const totalPaidOrders = paidOrderMap.get(user._id.toString()) || 0;
            return Object.assign(Object.assign({}, user.toObject()), { totalPaidOrders });
        }
        return user;
    });
    // ✅ Step 7: Return paginated response
    return {
        meta,
        usersWithOrders,
    };
});
const getSingleUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findById(id);
    //if no user found with the id
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    return result;
});
const getAllAdminFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.find({ role: "admin" });
    return result;
});
const getAdminProfileFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findById(id);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User does not exist!");
    }
    if (result.role !== "super-admin") {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized User!");
    }
    return result;
});
const getAllVendorFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorQuery = new QueryBuilder_1.default(user_model_1.UserModel.find(), query)
        .search(vendor_consts_1.VendorSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield vendorQuery.modelQuery;
    return result;
});
const updateUserOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findById(id);
    if (!isUserExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User does not Exists!");
    }
    if ((isUserExists === null || isUserExists === void 0 ? void 0 : isUserExists.email) !== (payload === null || payload === void 0 ? void 0 : payload.email)) {
        throw new handleAppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized User!");
    }
    if (payload === null || payload === void 0 ? void 0 : payload.password) {
        payload.password = yield bcrypt_1.default.hash(payload === null || payload === void 0 ? void 0 : payload.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    const { email } = payload, updateData = __rest(payload, ["email"]);
    const result = yield user_model_1.UserModel.findByIdAndUpdate(id, updateData, {
        new: true,
    });
    return result;
});
const delteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.UserModel.findById(id);
    if (!isUserExists) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User does not Exists!");
    }
    const result = yield user_model_1.UserModel.findByIdAndDelete(id);
    return result;
});
const getUserByEmailFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UserModel.findOne({ email });
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User not found with this email!");
    }
    return result;
});
exports.UserServices = {
    getAllUserFromDB,
    getSingleUserFromDB,
    getAllAdminFromDB,
    getAllVendorFromDB,
    getAdminProfileFromDB,
    updateUserOnDB,
    delteUserFromDB,
    getUserByEmailFromDB,
};
