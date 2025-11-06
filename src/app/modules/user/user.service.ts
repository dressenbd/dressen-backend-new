import bcrypt from "bcrypt";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import config from "../../config";
import AppError from "../../errors/handleAppError";
import { OrderModel } from "../order/order.model";
import { VendorSearchableFields } from "../vendor/vendor.consts";
import { UserSearchableFields } from "./user.const";
import { TUser } from "./user.interface";
import { UserModel } from "./user.model";

// const getAllUserFromDB = async () => {
//   const result = await UserModel.find();

//   return result;
// };

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  // ✅ Step 1: Build query with filters, search, sort, pagination
  const userQuery = new QueryBuilder(UserModel.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  // ✅ Step 2: Execute main query
  const users = await userQuery.modelQuery;

  // ✅ Step 3: Compute total count for pagination
  const meta = await userQuery.countTotal();

  // ✅ Step 4: Collect SR user IDs
  const srIds = users.filter((u) => u.role === "sr").map((u) => u._id);

  // ✅ Step 5: Aggregate to count total paid orders for SR users
  let paidOrderMap = new Map();
  if (srIds.length > 0) {
    const orderCounts = await OrderModel.aggregate([
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
    paidOrderMap = new Map(
      orderCounts.map((item) => [item._id.toString(), item.totalPaidOrders])
    );
  }

  // ✅ Step 6: Attach totalPaidOrders field to SR users
  const usersWithOrders = users.map((user) => {
    if (user.role === "sr") {
      const totalPaidOrders = paidOrderMap.get(user._id.toString()) || 0;
      return { ...user.toObject(), totalPaidOrders };
    }
    return user;
  });

  // ✅ Step 7: Return paginated response
  return {
    meta,
    usersWithOrders,
  };
};

const getSingleUserFromDB = async (id: string) => {
  const result = await UserModel.findById(id);

  //if no user found with the id
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  return result;
};

const getAllAdminFromDB = async () => {
  const result = await UserModel.find({ role: "admin" });
  return result;
};

const getAdminProfileFromDB = async (id: string) => {
  const result = await UserModel.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }
  if (result.role !== "super-admin") {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized User!");
  }
  return result;
};

const getAllVendorFromDB = async (query: Record<string, unknown>) => {
  const vendorQuery = new QueryBuilder(UserModel.find(), query)
    .search(VendorSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await vendorQuery.modelQuery;

  return result;
};

const updateUserOnDB = async (
  id: string,
  payload: Partial<TUser> & Pick<TUser, "email">
) => {
  const isUserExists = await UserModel.findById(id);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not Exists!");
  }

  if (isUserExists?.email !== payload?.email) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized User!");
  }

  if (payload?.password) {
    payload.password = await bcrypt.hash(
      payload?.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  const { email, ...updateData } = payload;

  const result = await UserModel.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  return result;
};

const delteUserFromDB = async (id: string) => {
  const isUserExists = await UserModel.findById(id);

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not Exists!");
  }

  const result = await UserModel.findByIdAndDelete(id);

  return result;
};

const getUserByEmailFromDB = async (email: string) => {
  const result = await UserModel.findOne({ email });
  
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found with this email!");
  }
  
  return result;
};

export const UserServices = {
  getAllUserFromDB,
  getSingleUserFromDB,
  getAllAdminFromDB,
  getAllVendorFromDB,
  getAdminProfileFromDB,
  updateUserOnDB,
  delteUserFromDB,
  getUserByEmailFromDB,
};
