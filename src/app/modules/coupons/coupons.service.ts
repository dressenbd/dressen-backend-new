import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import { CouponSearchableFields } from "./coupons.const";
import { TCoupon } from "./coupons.interface";
import { CouponModel } from "./coupons.model";

const getAllCouponsFromDB = async (query: Record<string, unknown>) => {
  const couponQuery = new QueryBuilder(CouponModel.find(), query)
    .search(CouponSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await couponQuery.modelQuery;

  return result;
};

const getSingleCouponFromDB = async (id: string) => {
  const result = CouponModel.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon does not exists!");
  }

  return result;
};

const createCouponIntoDB = async (payload: TCoupon) => {
  const isCouponExists = await CouponModel.findOne({ code: payload?.code });

  if (isCouponExists) {
    throw new AppError(httpStatus.CONFLICT, "Coupon already exists!");
  }

  const result = await CouponModel.create(payload);

  return result;
};

const updateCouponIntoDB = async (id: string, payload: Partial<TCoupon>) => {
  const isCouponExists = await CouponModel.findById(id);

  if (!isCouponExists) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon does not exists!");
  }

  const result = await CouponModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const deleteCouponFromDB = async (id: string) => {
  const result = await CouponModel.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon does not exists!");
  }

  return result;
};

export const couponServices = {
  getAllCouponsFromDB,
  getSingleCouponFromDB,
  createCouponIntoDB,
  updateCouponIntoDB,
  deleteCouponFromDB,
};
