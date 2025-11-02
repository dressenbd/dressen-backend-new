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
exports.storeOTP = storeOTP;
exports.verifyOTP = verifyOTP;
exports.resendAllowed = resendAllowed;
const redis_config_1 = require("../../config/redis.config");
function key(email, purpose) {
    return `otp:${purpose}:${email.toLowerCase()}`;
}
function storeOTP(email, purpose, otp, ttlSec) {
    return __awaiter(this, void 0, void 0, function* () {
        const redis = (0, redis_config_1.getRedis)();
        // node-redis v4 automatically returns a promise
        yield redis.set(key(email, purpose), otp, { EX: ttlSec });
    });
}
function verifyOTP(email, purpose, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        const redis = (0, redis_config_1.getRedis)();
        const stored = yield redis.get(key(email, purpose));
        if (!stored)
            return false;
        const match = stored === otp;
        if (match)
            yield redis.del(key(email, purpose));
        return match;
    });
}
function resendAllowed(_email, _purpose) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implement rate-limiting if needed using INCR + EX
        return true;
    });
}
