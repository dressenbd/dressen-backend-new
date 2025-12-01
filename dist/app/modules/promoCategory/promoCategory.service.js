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
exports.promoCategoryServices = void 0;
const handleAppError_1 = __importDefault(require("../../errors/handleAppError"));
const promoCategory_model_1 = require("./promoCategory.model");
const createPromoCategoryOnDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.slug && payload.name) {
        payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");
    }
    const result = yield promoCategory_model_1.PromoCategoryModel.create(payload);
    return result;
});
const getAllPromoCategoriesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promoCategory_model_1.PromoCategoryModel.find().sort({ createdAt: -1 });
    return result;
});
const getActivePromoCategoriesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promoCategory_model_1.PromoCategoryModel.find({ isActive: true }).sort({ createdAt: -1 });
    return result;
});
const getPromoCategoryByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promoCategory_model_1.PromoCategoryModel.findById(id);
    if (!result)
        throw new handleAppError_1.default(404, "Promo category not found!");
    return result;
});
const updatePromoCategoryOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promoCategory_model_1.PromoCategoryModel.findByIdAndUpdate(id, payload, { new: true });
    if (!result)
        throw new handleAppError_1.default(404, "Promo category not found!");
    return result;
});
const deletePromoCategoryFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield promoCategory_model_1.PromoCategoryModel.findByIdAndDelete(id);
    if (!result)
        throw new handleAppError_1.default(404, "Promo category not found!");
    return result;
});
exports.promoCategoryServices = {
    createPromoCategoryOnDB,
    getAllPromoCategoriesFromDB,
    getActivePromoCategoriesFromDB,
    getPromoCategoryByIdFromDB,
    updatePromoCategoryOnDB,
    deletePromoCategoryFromDB,
};
