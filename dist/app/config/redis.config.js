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
exports.getRedis = exports.disconnectRedis = exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
});
exports.redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
});
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!exports.redisClient.isOpen) {
        yield exports.redisClient.connect();
        console.log("Redis Connected");
    }
});
exports.connectRedis = connectRedis;
const disconnectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    if (exports.redisClient.isOpen) {
        yield exports.redisClient.quit();
        console.log("Redis Disconnected");
    }
});
exports.disconnectRedis = disconnectRedis;
// For compatibility with existing services importing getRedis()
const getRedis = () => exports.redisClient;
exports.getRedis = getRedis;
