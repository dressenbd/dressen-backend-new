"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
function generateOTP(length = 6) {
    const digits = "0123456789";
    let v = "";
    for (let i = 0; i < length; i++)
        v += digits[Math.floor(Math.random() * digits.length)];
    return v;
}
