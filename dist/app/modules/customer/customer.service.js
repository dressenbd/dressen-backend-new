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
exports.customerServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const customer_const_1 = require("./customer.const");
const customer_model_1 = require("./customer.model");
const customerPopulate = [
    { path: "userId" },
    { path: "cartItem.productInfo.productId" },
    { path: "wishlist" },
    { path: "orders.orderInfo" },
];
// Create Customer
const createCustomerOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield customer_model_1.CustomerModel.create(payload);
    return result.populate(customerPopulate);
});
// Get All Customers with filtering, searching, sorting, pagination
const getAllCustomerFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const customerQuery = new QueryBuilder_1.default(customer_model_1.CustomerModel.find().populate(customerPopulate), query)
        .search(customer_const_1.CustomerSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield customerQuery.modelQuery;
    return result;
});
// Get Single Customer by ID
const getSingleCustomerFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield customer_model_1.CustomerModel.findById(id).populate(customerPopulate);
    return result;
});
// ✅ Update Customer by ID
const updateCustomerOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield customer_model_1.CustomerModel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate(customerPopulate);
    return result;
});
const getMyCustomerInfoFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield customer_model_1.CustomerModel.findOne({ userId: id }).populate(customerPopulate);
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "User does not exists!");
    }
    return result;
});
const getWishlistFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield customer_model_1.CustomerModel.findOne({ userId }).populate({
        path: 'wishlist',
        select: 'description.name productInfo.price productInfo.salePrice featuredImg gallery productInfo.discount'
    });
    if (!result) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Wrong userId!");
    }
    return result.wishlist;
});
const addToWishlistDB = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if customer exists first
    const existingCustomer = yield customer_model_1.CustomerModel.findOne({ userId });
    if (!existingCustomer) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Wrong userId!");
    }
    // Check if product already in wishlist
    if (existingCustomer.wishlist.includes(productId)) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Product already exists in wishlist!");
    }
    const result = yield customer_model_1.CustomerModel.findOneAndUpdate({ userId }, { $addToSet: { wishlist: productId } }, { new: true }).populate({
        path: 'wishlist',
        select: 'description.name productInfo.price productInfo.salePrice featuredImg gallery productInfo.discount'
    });
    return result.wishlist;
});
const removeFromWishlistDB = (userId, productId) => __awaiter(void 0, void 0, void 0, function* () {
    // First check if customer exists and product is in wishlist
    const existingCustomer = yield customer_model_1.CustomerModel.findOne({ userId });
    if (!existingCustomer) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Wrong userId!");
    }
    // Check if product exists in wishlist
    if (!existingCustomer.wishlist.includes(productId)) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Product not found in wishlist!");
    }
    const result = yield customer_model_1.CustomerModel.findOneAndUpdate({ userId }, { $pull: { wishlist: productId } }, { new: true }).populate({
        path: 'wishlist',
        select: 'description.name productInfo.price productInfo.salePrice featuredImg gallery productInfo.discount'
    });
    return result.wishlist;
});
const clearWishlistDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if customer exists first
    const existingCustomer = yield customer_model_1.CustomerModel.findOne({ userId });
    if (!existingCustomer) {
        throw new handleAppError_1.default(http_status_1.default.NOT_FOUND, "Wrong userId!");
    }
    // Check if wishlist is already empty
    if (existingCustomer.wishlist.length === 0) {
        throw new handleAppError_1.default(http_status_1.default.BAD_REQUEST, "Wishlist is already empty!");
    }
    const result = yield customer_model_1.CustomerModel.findOneAndUpdate({ userId }, { $set: { wishlist: [] } }, { new: true });
    return result.wishlist;
});
exports.customerServices = {
    createCustomerOnDB,
    getSingleCustomerFromDB,
    getAllCustomerFromDB,
    updateCustomerOnDB,
    getMyCustomerInfoFromDB,
    getWishlistFromDB,
    addToWishlistDB,
    removeFromWishlistDB,
    clearWishlistDB,
};
