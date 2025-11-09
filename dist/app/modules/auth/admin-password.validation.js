"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminPasswordValidations = void 0;
const zod_1 = require("zod");
const changeAdminPasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z
        .string()
        .min(6, "Current password must be at least 6 characters"),
    newPassword: zod_1.z
        .string()
        .min(6, "New password must be at least 6 characters")
        .max(50, "New password cannot exceed 50 characters"),
});
exports.AdminPasswordValidations = {
    changeAdminPasswordSchema,
};
