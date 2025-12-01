"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickOrderZodSchema = exports.createBulkOrdersZodSchema = exports.createAdminOrderZodSchema = void 0;
const zod_1 = require("zod");
// ObjectId validation
const objectIdSchema = zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId string");
// Shipping schema - make it optional
const shippingSchema = zod_1.z.object({
    name: zod_1.z.string().default("Standard"),
    type: zod_1.z.enum(["free", "percentage", "amount"]).default("free"),
}).optional();
// Total amount schema with optional shipping
const totalAmountSchema = zod_1.z.object({
    subTotal: zod_1.z.number(),
    tax: zod_1.z.number().optional().default(0),
    shipping: shippingSchema,
    discount: zod_1.z.number().default(0),
    total: zod_1.z.number(),
});
// Commission schema
const commissionSchema = zod_1.z.object({
    type: zod_1.z.enum(["percentage", "fixed"]),
    value: zod_1.z.number(),
    amount: zod_1.z.number(),
});
// Customer info with optional email
const customerInfoSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    phone: zod_1.z.string().min(1, "Phone is required"),
    address: zod_1.z.string().min(1, "Address is required"),
    city: zod_1.z.string().optional(),
    postalCode: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
// Order info schema
const orderInfoSchema = zod_1.z.object({
    productInfo: objectIdSchema,
    quantity: zod_1.z.number().min(1),
    totalAmount: totalAmountSchema,
    commission: commissionSchema,
});
// Admin-specific order validation
exports.createAdminOrderZodSchema = zod_1.z.object({
    orderSource: zod_1.z.enum(["phone", "walk-in", "online", "whatsapp", "facebook"]),
    orderInfo: zod_1.z.array(orderInfoSchema).min(1),
    customerInfo: customerInfoSchema,
    paymentInfo: zod_1.z.union([zod_1.z.literal("cash-on"), zod_1.z.object({}).passthrough()]),
    totalAmount: zod_1.z.number(),
    adminNotes: zod_1.z.string().optional(),
    customerType: zod_1.z.enum(["new", "existing", "guest"]).optional().default("guest"),
    assignedSR: objectIdSchema.optional(),
    status: zod_1.z.enum(["pending", "processing", "paid", "cancelled"]).optional().default("pending"),
});
// Bulk order validation
exports.createBulkOrdersZodSchema = zod_1.z.object({
    orders: zod_1.z.array(exports.createAdminOrderZodSchema).min(1, "At least one order is required")
});
// Quick order validation (for walk-in customers)
exports.quickOrderZodSchema = zod_1.z.object({
    customerInfo: zod_1.z.object({
        fullName: zod_1.z.string().min(1, "Customer name is required"),
        phone: zod_1.z.string().min(1, "Phone number is required"),
        address: zod_1.z.string().optional().default("Walk-in customer"),
    }),
    products: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/),
        quantity: zod_1.z.number().min(1),
        price: zod_1.z.number().min(0),
    })).min(1, "At least one product is required"),
    paymentMethod: zod_1.z.enum(["cash", "card", "mobile-banking"]).default("cash"),
    orderSource: zod_1.z.literal("walk-in"),
    discount: zod_1.z.number().min(0).default(0),
});
