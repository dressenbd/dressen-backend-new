"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathaoConfig = void 0;
exports.pathaoConfig = {
    baseURL: process.env.PATHAO_BASE_URL || "https://courier-api-sandbox.pathao.com/aladdin/api/v1",
    clientId: process.env.PATHAO_CLIENT_ID,
    clientSecret: process.env.PATHAO_CLIENT_SECRET,
    username: process.env.PATHAO_USERNAME,
    password: process.env.PATHAO_PASSWORD,
};
