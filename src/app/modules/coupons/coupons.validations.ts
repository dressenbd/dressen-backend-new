import { z } from "zod";

export const createCouponZodSchema = z.object({
  image: z.string().optional(),
  code: z.string({
    error: (issue) =>
      issue.input === undefined ? "Code is required!" : "Not a string!",
  }),

  description: z.string().optional(),

  minimumPurchaseAmount: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "Minimum purchase amount is required!"
        : "Must be a number!",
  }),

  type: z.enum(["fixed", "percentage", "free-shipping"], {
    message: "Type must be either 'fixed' or 'percentage' or 'free-shipping'",
  }),

  discountAmount: z.number({
    error: (issue) =>
      issue.input === undefined
        ? "Discount amount is required!"
        : "Must be a number!",
  }),

  isVerifiedCustomer: z.boolean().optional().default(false),

  isApproved: z.boolean().optional().default(false),

  activeDate: z.string().optional(),

  expireDate: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Expire date is required!"
          : "Not a valid date string!",
    })
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid expire date!",
    }),
});
