import { z } from "zod";

// ObjectId validation
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Must be a valid ObjectId string");

// Shipping schema - make it optional
const shippingSchema = z.object({
  name: z.string().default("Standard"),
  type: z.enum(["free", "percentage", "amount"]).default("free"),
}).optional();

// Total amount schema with optional shipping
const totalAmountSchema = z.object({
  subTotal: z.number(),
  tax: z.number().optional().default(0),
  shipping: shippingSchema,
  discount: z.number().default(0),
  total: z.number(),
});

// Commission schema
const commissionSchema = z.object({
  type: z.enum(["percentage", "fixed"]),
  value: z.number(),
  amount: z.number(),
});

// Customer info with optional email
const customerInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

// Order info schema
const orderInfoSchema = z.object({
  productInfo: objectIdSchema,
  quantity: z.number().min(1),
  totalAmount: totalAmountSchema,
  commission: commissionSchema,
});

// Admin-specific order validation
export const createAdminOrderZodSchema = z.object({
  orderSource: z.enum(["phone", "walk-in", "online", "whatsapp", "facebook"]),
  orderInfo: z.array(orderInfoSchema).min(1),
  customerInfo: customerInfoSchema,
  paymentInfo: z.union([z.literal("cash-on"), z.object({}).passthrough()]),
  totalAmount: z.number(),
  adminNotes: z.string().optional(),
  customerType: z.enum(["new", "existing", "guest"]).optional().default("guest"),
  assignedSR: objectIdSchema.optional(),
  status: z.enum(["pending", "processing", "paid", "cancelled"]).optional().default("pending"),
});

// Bulk order validation
export const createBulkOrdersZodSchema = z.object({
  orders: z.array(createAdminOrderZodSchema).min(1, "At least one order is required")
});

// Quick order validation (for walk-in customers)
export const quickOrderZodSchema = z.object({
  customerInfo: z.object({
    fullName: z.string().min(1, "Customer name is required"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().optional().default("Walk-in customer"),
  }),
  products: z.array(z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    quantity: z.number().min(1),
    price: z.number().min(0),
  })).min(1, "At least one product is required"),
  paymentMethod: z.enum(["cash", "card", "mobile-banking"]).default("cash"),
  orderSource: z.literal("walk-in"),
  discount: z.number().min(0).default(0),
});