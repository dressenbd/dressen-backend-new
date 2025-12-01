"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promoCategoryValidations = void 0;
const zod_1 = require("zod");
const createPromoCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        description: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
    }),
});
const updatePromoCategoryValidation = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
    }),
});
exports.promoCategoryValidations = {
    createPromoCategoryValidation,
    updatePromoCategoryValidation,
};
