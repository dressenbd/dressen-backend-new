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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailVerification = sendEmailVerification;
exports.sendPasswordResetOTP = sendPasswordResetOTP;
const nodemailer_config_1 = require("../config/nodemailer.config");
const transporter = (0, nodemailer_config_1.createTransport)();
function sendEmailVerification(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transporter.sendMail({
            to: email,
            from: process.env.EMAIL_FROM,
            subject: "Verify your email - Dressen",
            text: `Your one-time verification code is ${otp}. It expires in 5 minutes.`,
            html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <h1 style="color: #dc4d01; margin-bottom: 20px;">Dressen</h1>
          <p style="font-size: 16px; color: #333;">Your one-time verification code:</p>
          <h2 style="font-size: 32px; color: #000; letter-spacing: 2px; margin: 15px 0;">${otp}</h2>
          <p style="font-size: 14px; color: #555;">This code expires after <b>5 minutes</b>.  
          If you did not request this, please ignore this email or reset your password immediately.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">© 2025 Dressen. All rights reserved.</p>
        </div>
      </div>
    `,
        });
    });
}
function sendPasswordResetOTP(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        yield transporter.sendMail({
            to: email,
            from: process.env.EMAIL_FROM,
            subject: "Password Reset OTP - Dressen",
            text: `Your password reset OTP is ${otp}. It expires in 5 minutes.`,
            html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          <h1 style="color: #dc4d01; margin-bottom: 20px;">Dressen</h1>
          <p style="font-size: 16px; color: #333;">Your password reset code:</p>
          <h2 style="font-size: 32px; color: #000; letter-spacing: 2px; margin: 15px 0;">${otp}</h2>
          <p style="font-size: 14px; color: #555;">This code expires after <b>5 minutes</b>.  
          If you did not request this, please secure your account immediately.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">© 2025 Dressen. All rights reserved.</p>
        </div>
      </div>
    `,
        });
    });
}
