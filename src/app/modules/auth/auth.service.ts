// import config from '../../config';
// import { UserModel } from '../user/user.model';
// import { TAuth, TExternalProviderAuth } from './auth.interface';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import AppError from '../../errors/handleAppError';
// import httpStatus from 'http-status';
// import { StatusCodes } from 'http-status-codes';

// //register a user in database
// const registerUserOnDB = async (payload: TAuth) => {
//   const result = await UserModel.create(payload);
//   return result;
// };

// //login an user with credentials
// const loginUserFromDB = async (payload: TAuth) => {
//   const isUserExists = await UserModel.findOne({
//     email: payload?.email,
//   });

//   if (!isUserExists) {
//     throw Error('User does not exists!');
//   }

//   if (!isUserExists?.password) {
//     throw new Error(
//       'This account is registered via Google login. Please use Google login.'
//     );
//   }

//   if (!payload?.password) {
//     throw new Error('Password is required');
//   }
//   const isPasswordMatched = await bcrypt.compare(
//     payload.password,
//     isUserExists.password
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.UNAUTHORIZED, 'Wrong Credentials!');
//   }

//   const user = await UserModel.findByIdAndUpdate(
//     isUserExists?._id,
//     { status: 'active' },
//     { new: true }
//   );

//   return user;
// };

// //login an user with credentials
// const loginUserUsingProviderFromDB = async (payload: TExternalProviderAuth) => {
//   const isUserExists = await UserModel.findOne({
//     email: payload?.email,
//   });

//   // Check if a user exists with the provided email
//   if (!isUserExists) {
//     const result = await UserModel.create(payload);

//     const jwtPayload = {
//       email: result?.email,
//       role: result?.role,
//     };

//     //token
//     const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
//       expiresIn: '24h',
//     });

//     const userObject = {
//       user: result,
//       accessToken: token,
//     };

//     return userObject;
//   }

//   const user = await UserModel.findByIdAndUpdate(
//     isUserExists?._id,
//     { status: 'active' },
//     { new: true }
//   );

//   //generating token
//   const jwtPayload = {
//     email: isUserExists?.email,
//     role: isUserExists?.role,
//   };

//   //token
//   const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
//     expiresIn: '24h',
//   });

//   const userObject = {
//     user: user,
//     accessToken: token,
//   };

//   return userObject;
// };

// //logout current user and removing token from cookie
// const logoutUserFromDB = async (id: string) => {
//   await UserModel.findByIdAndUpdate(id, { status: 'inActive' }, { new: true });
//   return {};
// };

// const getMe = async (decodedUser: JwtPayload) => {
//   const me = await UserModel.findById(decodedUser.userId).select('-password');

//   if (!me) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
//   }

//   return me;
// };

// export const AuthServices = {
//   registerUserOnDB,
//   loginUserFromDB,
//   logoutUserFromDB,
//   loginUserUsingProviderFromDB,
//   getMe,
// };

import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import AppError from "../../errors/handleAppError";
import {
  sendEmailVerification,
  sendPasswordResetOTP,
} from "../../utils/email.service";
import { generateOTP } from "../../utils/generate.otp";
import { storeOTP, verifyOTP } from "../otp/otp.service";
import { UserModel } from "../user/user.model";
import { TAuth, TExternalProviderAuth } from "./auth.interface";

/**
 * Register user in the database
 * Sets default status based on user role:
 * - 'active' for customer, admin, super-admin
 * - 'pending' for others
 */
// const registerUserOnDB = async (payload: TAuth) => {
//   // Determine user status based on role
//   const activeRoles = ["customer", "admin", "super-admin"];
//   const role = payload.role || "customer";
//   const status = activeRoles.includes(role) ? "active" : "pending";

//   const userData = {
//     ...payload,
//     role,
//     status,
//   };

//   const result = await UserModel.create(userData);
//   return result;
// };

const registerUserOnDB = async (payload: TAuth) => {
  const email = payload.email.toLowerCase();

  // ✅ Check if user already exists
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw new Error("Email already registered");
  }

  // ✅ Determine role & status
  const activeRoles = ["customer", "admin", "super-admin"];
  const role = payload.role || "customer";
  const status = activeRoles.includes(role) ? "active" : "pending";

  // ✅ Hash password
  if (!payload?.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }
  // const hashedPassword = await bcrypt.hash(payload.password, 10);

  // ✅ Create user with default isEmailVerified = false
  const userData = {
    ...payload,
    email,
    // password: hashedPassword,
    role,
    status,
    isEmailVerified: false,
  };

  const user = await UserModel.create(userData);

  // ✅ Generate and store OTP
  const otp = generateOTP();
  await storeOTP(
    email,
    "email_verification",
    otp,
    Number(process.env.OTP_TTL_SECONDS || 300)
  );

  // ✅ Send verification email
  await sendEmailVerification(email, otp);

  // ✅ Return user + info
  return {
    user,
    // otp,
  };
};

const verifyEmailOnDB = async (email: string, otp: string) => {
  // ✅ Verify OTP from stored records
  const ok = await verifyOTP(email, "email_verification", otp);
  if (!ok) {
    throw new Error("Invalid or expired OTP");
  }

  // ✅ Update user's email verification status
  await UserModel.updateOne(
    { email: email.toLowerCase() },
    { $set: { isEmailVerified: true } }
  );

  return {
    message: "Email has been verified successfully.",
  };
};

/**
 * Login a user using email/password
 */
const loginUserFromDB = async (payload: TAuth) => {
  const isUserExists = await UserModel.findOne({
    email: payload?.email,
  });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist!");
  }

  if (!isUserExists?.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This account is registered via Google login. Please use Google login."
    );
  }

  if (!payload?.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isUserExists.password
  );

  const isEmailVerified = isUserExists.isEmailVerified;

  if (!isEmailVerified) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Email not verified. Please verify your email before logging in."
    );
  }

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Wrong Credentials!");
  }

  // Prevent login if user is pending or blocked
  if (isUserExists.status === "pending") {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Your account is under review. Please wait for approval."
    );
  }

  if (isUserExists.status === "blocked") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is blocked. Contact support."
    );
  }

  // Update status to active on successful login
  const user = await UserModel.findByIdAndUpdate(
    isUserExists._id,
    { status: "active" },
    { new: true }
  );

  return user;
};

/**
 * Login or register user via external providers (e.g. Google)
 */
const loginUserUsingProviderFromDB = async (payload: TExternalProviderAuth) => {
  const isUserExists = await UserModel.findOne({ email: payload?.email });

  if (!isUserExists) {
    // Determine user status for new provider accounts
    const activeRoles = ["customer", "admin", "super-admin"];
    const role = payload.role || "customer";
    const status = activeRoles.includes(role) ? "active" : "pending";

    const result = await UserModel.create({ ...payload, role, status });

    const jwtPayload = {
      userId: result._id,
      email: result.email,
      role: result.role,
    };

    const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
      expiresIn: "24h",
    });

    return {
      user: result,
      accessToken: token,
    };
  }

  // Check existing user’s status before allowing login
  if (isUserExists.status === "pending") {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Your account is under review. Please wait for approval."
    );
  }

  if (isUserExists.status === "blocked") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your account is blocked. Contact support."
    );
  }

  const user = await UserModel.findByIdAndUpdate(
    isUserExists._id,
    { status: "active" },
    { new: true }
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found after update");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "24h",
  });

  return {
    user,
    accessToken: token,
  };
};

/**
 * Logout user and mark as inactive
 */
const logoutUserFromDB = async (id: string) => {
  await UserModel.findByIdAndUpdate(id, { status: "inactive" }, { new: true });
  return {};
};

/**
 * 🔹 Resend OTP for email verification
 */
const resendOtp = async (email: string) => {
  const otp = generateOTP();
  await storeOTP(
    email,
    "email_verification",
    otp,
    Number(process.env.OTP_TTL_SECONDS || 300)
  );
  await sendEmailVerification(email, otp);
  return { message: "OTP resent successfully!" };
};

/**
 * 🔹 Forgot Password - generate OTP for password reset
 */
const forgotPassword = async (email: string) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    return { message: "If account exists, OTP sent" }; // Prevent user enumeration
  }

  const otp = generateOTP();
  await storeOTP(
    email,
    "password_reset",
    otp,
    Number(process.env.OTP_TTL_SECONDS || 300)
  );
  await sendPasswordResetOTP(email, otp);
  return { message: "OTP sent successfully!" };
};

/**
 * 🔹 Reset password using OTP
 */
const resetPasswordWithOtp = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const ok = await verifyOTP(email, "password_reset", otp);
  if (!ok) throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");

  const hash = await bcrypt.hash(newPassword, 10);
  await UserModel.updateOne(
    { email: email.toLowerCase() },
    { password: hash, tokenVersion: Date.now() }
  );

  return { message: "Password updated successfully!" };
};

/**
 * 🔹 Reset password when logged in (no OTP)
 */
const resetPasswordLoggedIn = async (userId: string, newPassword: string) => {
  const hash = await bcrypt.hash(newPassword, 10);
  await UserModel.updateOne(
    { _id: userId },
    { password: hash, tokenVersion: Date.now() }
  );
  return { message: "Password updated successfully!" };
};

/**
 * Get current user info using decoded JWT
 */
const getMe = async (decodedUser: JwtPayload) => {
  const me = await UserModel.findById(decodedUser.userId).select("-password");

  if (!me) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return me;
};

export const AuthServices = {
  registerUserOnDB,
  loginUserFromDB,
  logoutUserFromDB,
  loginUserUsingProviderFromDB,
  getMe,
  resendOtp,
  forgotPassword,
  resetPasswordWithOtp,
  resetPasswordLoggedIn,
  verifyEmailOnDB,
};
