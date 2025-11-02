import z from "zod";

const registerUser = z.object({
  name: z
    .string()
    .min(1, "Name is required to create a user!")
    .max(40, "Name must be less than 40 characters!"),
  email: z
    .string()
    .email("Invalid email format!")
    .min(1, "Email is required to create a user!")
    .max(50, "Email must be less than 50 characters!"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long!")
    .max(20, "Password must be less than 20 characters!"),
});

const loginUser = z.object({
  email: z
    .string()
    .email("Invalid email format!")
    .min(1, "Email is required to create a user!")
    .max(50, "Email must be less than 50 characters!"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long!")
    .max(20, "Password must be less than 20 characters!"),
});

const loginUserUsingProvider = z.object({
  name: z
    .string()
    .min(1, "Name is required to create a user!")
    .max(40, "Name must be less than 40 characters!"),
  email: z
    .string()
    .email("Invalid email format!")
    .min(1, "Email is required to create a user!")
    .max(50, "Email must be less than 50 characters!"),
});

// OTP and Password Reset Validators
const otpSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

//OTP Resend Validators
const resendOtpSchema = z.object({
  email: z.email(),
});

//Reset Password Validators
const resetPasswordSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
});

export const AuthValidations = {
  registerUser,
  loginUser,
  loginUserUsingProvider,
  otpSchema,
  resendOtpSchema,
  resetPasswordSchema,
};
