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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const redis_config_1 = require("./config/redis.config");
const port = config_1.default.port || 5000;
let server;
let shuttingDown = false;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            // Connect Redis
            yield (0, redis_config_1.connectRedis)();
            server = app_1.default.listen(port, () => {
                console.log(`Dressen Server listening on port ${port}`);
            });
            process.on("SIGINT", gracefulShutdown);
            process.on("SIGTERM", gracefulShutdown);
            process.on("uncaughtException", (err) => {
                console.error("Uncaught Exception:", err);
                gracefulShutdown();
            });
            process.on("unhandledRejection", (reason) => {
                console.error("Unhandled Rejection:", reason);
                gracefulShutdown();
            });
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }
    });
}
function gracefulShutdown() {
    return __awaiter(this, void 0, void 0, function* () {
        if (shuttingDown)
            return;
        shuttingDown = true;
        console.log("Graceful shutdown initiated...");
        try {
            if (server) {
                yield new Promise((resolve) => {
                    server.close(() => {
                        console.log("HTTP server closed");
                        resolve();
                    });
                });
            }
            yield (0, redis_config_1.disconnectRedis)();
            yield mongoose_1.default.disconnect();
            console.log("All connections closed. Exiting.");
            process.exit(0);
        }
        catch (err) {
            console.error("Error during shutdown:", err);
            process.exit(1);
        }
    });
}
main();
