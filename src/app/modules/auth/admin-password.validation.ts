import { z } from "zod";

const changeAdminPasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, "Current password must be at least 6 characters"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(50, "New password cannot exceed 50 characters"),
});

export const AdminPasswordValidations = {
  changeAdminPasswordSchema,
};