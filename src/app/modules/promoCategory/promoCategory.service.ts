import AppError from "../../errors/handleAppError";
import { TPromoCategory } from "./promoCategory.interface";
import { PromoCategoryModel } from "./promoCategory.model";

const createPromoCategoryOnDB = async (payload: TPromoCategory) => {
  if (!payload.slug && payload.name) {
    payload.slug = payload.name.toLowerCase().replace(/\s+/g, "-");
  }
  const result = await PromoCategoryModel.create(payload);
  return result;
};

const getAllPromoCategoriesFromDB = async () => {
  const result = await PromoCategoryModel.find().sort({ createdAt: -1 });
  return result;
};

const getActivePromoCategoriesFromDB = async () => {
  const result = await PromoCategoryModel.find({ isActive: true }).sort({ createdAt: -1 });
  return result;
};

const getPromoCategoryByIdFromDB = async (id: string) => {
  const result = await PromoCategoryModel.findById(id);
  if (!result) throw new AppError(404, "Promo category not found!");
  return result;
};

const updatePromoCategoryOnDB = async (id: string, payload: Partial<TPromoCategory>) => {
  const result = await PromoCategoryModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(404, "Promo category not found!");
  return result;
};

const deletePromoCategoryFromDB = async (id: string) => {
  const result = await PromoCategoryModel.findByIdAndDelete(id);
  if (!result) throw new AppError(404, "Promo category not found!");
  return result;
};

export const promoCategoryServices = {
  createPromoCategoryOnDB,
  getAllPromoCategoriesFromDB,
  getActivePromoCategoriesFromDB,
  getPromoCategoryByIdFromDB,
  updatePromoCategoryOnDB,
  deletePromoCategoryFromDB,
};
