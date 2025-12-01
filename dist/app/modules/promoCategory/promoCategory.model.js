"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCategoryModel = void 0;
const mongoose_1 = require("mongoose");
const promoCategorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Promo category name is required!"],
        unique: true,
    },
    slug: { type: String },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
}, { timestamps: true });
exports.PromoCategoryModel = (0, mongoose_1.model)("PromoCategory", promoCategorySchema);
