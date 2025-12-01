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
exports.promoCategoryControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const promoCategory_service_1 = require("./promoCategory.service");
const createPromoCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const body = req.body;
    const data = {
        name: body.name,
        description: body.description,
        isActive: body.isActive === "true" || body.isActive === true,
        startDate: body.startDate,
        endDate: body.endDate,
    };
    if (file)
        data.image = file.path;
    const result = yield promoCategory_service_1.promoCategoryServices.createPromoCategoryOnDB(data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Promo category created successfully!",
        data: result,
    });
}));
const getAllPromoCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promoCategory_service_1.promoCategoryServices.getAllPromoCategoriesFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Promo categories retrieved successfully!",
        data: result,
    });
}));
const getActivePromoCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promoCategory_service_1.promoCategoryServices.getActivePromoCategoriesFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Active promo categories retrieved successfully!",
        data: result,
    });
}));
const getPromoCategoryById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promoCategory_service_1.promoCategoryServices.getPromoCategoryByIdFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Promo category retrieved successfully!",
        data: result,
    });
}));
const updatePromoCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const body = req.body;
    const data = {};
    if (body.name)
        data.name = body.name;
    if (body.description !== undefined)
        data.description = body.description;
    if (body.isActive !== undefined)
        data.isActive = body.isActive === "true" || body.isActive === true;
    if (body.startDate)
        data.startDate = body.startDate;
    if (body.endDate)
        data.endDate = body.endDate;
    if (file)
        data.image = file.path;
    const result = yield promoCategory_service_1.promoCategoryServices.updatePromoCategoryOnDB(req.params.id, data);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Promo category updated successfully!",
        data: result,
    });
}));
const deletePromoCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promoCategory_service_1.promoCategoryServices.deletePromoCategoryFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Promo category deleted successfully!",
        data: result,
    });
}));
exports.promoCategoryControllers = {
    createPromoCategory,
    getAllPromoCategories,
    getActivePromoCategories,
    getPromoCategoryById,
    updatePromoCategory,
    deletePromoCategory,
};
