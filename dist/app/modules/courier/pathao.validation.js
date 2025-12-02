"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePriceSchema = exports.bulkOrderSchema = exports.createOrderSchema = exports.createStoreSchema = void 0;
const zod_1 = require("zod");
exports.createStoreSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3).max(50),
        contact_name: zod_1.z.string().min(3).max(50),
        contact_number: zod_1.z.string().length(11),
        secondary_contact: zod_1.z.string().optional(),
        otp_number: zod_1.z.string().optional(),
        address: zod_1.z.string().min(10).max(120),
        city_id: zod_1.z.number().int().positive(),
        zone_id: zod_1.z.number().int().positive(),
        area_id: zod_1.z.number().int().positive(),
    }).or(zod_1.z.object({
        storeData: zod_1.z.object({
            name: zod_1.z.string().min(3).max(50),
            contact_name: zod_1.z.string().min(3).max(50),
            contact_number: zod_1.z.string().length(11),
            secondary_contact: zod_1.z.string().optional(),
            otp_number: zod_1.z.string().optional(),
            address: zod_1.z.string().min(10).max(120),
            city_id: zod_1.z.number().int().positive(),
            zone_id: zod_1.z.number().int().positive(),
            area_id: zod_1.z.number().int().positive(),
        })
    })),
});
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        store_id: zod_1.z.number().int().positive(),
        merchant_order_id: zod_1.z.string().optional(),
        recipient_name: zod_1.z.string().min(3).max(100),
        recipient_phone: zod_1.z.string().length(11),
        recipient_secondary_phone: zod_1.z.string().length(11).optional(),
        recipient_address: zod_1.z.string().min(10).max(220),
        recipient_city: zod_1.z.number().int().positive().optional(),
        recipient_zone: zod_1.z.number().int().positive().optional(),
        recipient_area: zod_1.z.number().int().positive().optional(),
        delivery_type: zod_1.z.union([zod_1.z.literal(12), zod_1.z.literal(48)]),
        item_type: zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2)]),
        special_instruction: zod_1.z.string().optional(),
        item_quantity: zod_1.z.number().int().positive(),
        item_weight: zod_1.z.number().min(0.5).max(10),
        item_description: zod_1.z.string().optional(),
        amount_to_collect: zod_1.z.number().int().min(0),
    }),
});
exports.bulkOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        orders: zod_1.z.array(exports.createOrderSchema.shape.body).min(1).max(50),
    }),
});
exports.calculatePriceSchema = zod_1.z.object({
    body: zod_1.z.object({
        store_id: zod_1.z.number().int().positive(),
        item_type: zod_1.z.union([zod_1.z.literal(1), zod_1.z.literal(2)]),
        delivery_type: zod_1.z.union([zod_1.z.literal(12), zod_1.z.literal(48)]),
        item_weight: zod_1.z.number().min(0.5).max(10),
        recipient_city: zod_1.z.number().int().positive(),
        recipient_zone: zod_1.z.number().int().positive(),
    }),
});
