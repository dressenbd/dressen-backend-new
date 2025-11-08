import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUserFromDB(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All user data retrieve successfully!",
    meta: result.meta,
    data: result.usersWithOrders,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.getSingleUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User data retrieve successfully!",
    data: result,
  });
});

const getAllAdminUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllAdminFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All admin data retrieve successfully!",
    data: result,
  });
});

const getSuperAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.getAdminProfileFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Super admin data retrieve successfully!",
    data: result,
  });
});

const getAllVendorUser = catchAsync(async (req, res) => {
  const result = await UserServices.getAllVendorFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All vendor data retrieve successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  const result = await UserServices.updateUserOnDB(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.delteUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully!",
    data: result,
  });
});

const getUserByEmail = catchAsync(async (req, res) => {
  const email = req.params.email;
  const result = await UserServices.getUserByEmailFromDB(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully!",
    data: result,
  });
});

export const UserControllers = {
  getSingleUser,
  getAllUser,
  getAllAdminUser,
  getSuperAdmin,
  getAllVendorUser,
  updateUser,
  deleteUser,
  getUserByEmail,
};
