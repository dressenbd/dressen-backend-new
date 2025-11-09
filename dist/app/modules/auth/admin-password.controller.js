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
exports.AdminPasswordController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_model_1 = require("../user/user.model");
/**
 * Change admin password (requires current password verification)
 */
const changeAdminPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedUser = req.user;
    const userId = decodedUser === null || decodedUser === void 0 ? void 0 : decodedUser.userId;
    const { currentPassword, newPassword } = req.body;
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: "Unauthorized request!",
            data: null,
        });
    }
    if (!currentPassword || !newPassword) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "Current password and new password are required!",
            data: null,
        });
    }
    if (currentPassword.length < 6 || newPassword.length < 6) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "Passwords must be at least 6 characters long!",
            data: null,
        });
    }
    // Get admin user with password
    const admin = yield user_model_1.UserModel.findById(userId).select("+password");
    if (!admin) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
            message: "Admin not found!",
            data: null,
        });
    }
    // Verify admin role
    if (!admin.role || !["admin", "super-admin"].includes(admin.role)) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.FORBIDDEN,
            message: "Access denied! Admin privileges required.",
            data: null,
        });
    }
    // Verify current password
    if (!admin.password) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "This account uses OAuth login. Cannot change password.",
            data: null,
        });
    }
    const isCurrentPasswordValid = yield bcrypt_1.default.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: "Current password is incorrect!",
            data: null,
        });
    }
    // Hash new password
    const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
    // Update password
    yield user_model_1.UserModel.findByIdAndUpdate(userId, {
        password: hashedNewPassword,
        tokenVersion: Date.now(), // Invalidate existing tokens
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Admin password changed successfully!",
        data: { message: "Password updated successfully" },
    });
}));
exports.AdminPasswordController = {
    changeAdminPassword,
};
