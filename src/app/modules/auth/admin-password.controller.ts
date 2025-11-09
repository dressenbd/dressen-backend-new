import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserModel } from "../user/user.model";

/**
 * Change admin password (requires current password verification)
 */
const changeAdminPassword = catchAsync(async (req, res) => {
  const decodedUser = req.user as JwtPayload;
  const userId = decodedUser?.userId;
  const { currentPassword, newPassword } = req.body;



  if (!userId) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Unauthorized request!",
      data: null,
    });
  }

  if (!currentPassword || !newPassword) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Current password and new password are required!",
      data: null,
    });
  }

  if (currentPassword.length < 6 || newPassword.length < 6) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Passwords must be at least 6 characters long!",
      data: null,
    });
  }

  // Get admin user with password
  const admin = await UserModel.findById(userId).select("+password");
  
  if (!admin) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.NOT_FOUND,
      message: "Admin not found!",
      data: null,
    });
  }

  // Verify admin role
  if (!admin.role || !["admin", "super-admin"].includes(admin.role)) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.FORBIDDEN,
      message: "Access denied! Admin privileges required.",
      data: null,
    });
  }

  // Verify current password
  if (!admin.password) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "This account uses OAuth login. Cannot change password.",
      data: null,
    });
  }

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
  
  if (!isCurrentPasswordValid) {
    return sendResponse(res, {
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Current password is incorrect!",
      data: null,
    });
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  await UserModel.findByIdAndUpdate(userId, {
    password: hashedNewPassword,
    tokenVersion: Date.now(), // Invalidate existing tokens
  });

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Admin password changed successfully!",
    data: { message: "Password updated successfully" },
  });
});

export const AdminPasswordController = {
  changeAdminPassword,
};