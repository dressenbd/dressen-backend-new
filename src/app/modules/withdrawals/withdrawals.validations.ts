import { z } from "zod";

// 🔹 Withdrawals Validation Schema
export const createWithdrawalZodSchema = z.object({
  // shopId: z.string({
  //   error: (issue) =>
  //     issue.input === undefined ? "Shop ID is required!" : "Not a string!",
  // }),

  amount: z
    .number({
      error: (issue) =>
        issue.input === undefined ? "Amount is required!" : "Not a number!",
    })
    .min(1, "Amount must be greater than 0!"),

  paymentMethod: z.enum(
    ["cash-on", "bank-transfer", "bKash", "nagad", "rocket", "upay"],
    {
      message:
        "Payment method must be one of: cash-on | bank-transfer | bKash | nagad | rocket | upay",
    }
  ),
  paymentAccountNumber: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Payment account number is required!"
        : "Not a string!",
  }),

  status: z.enum(["approved", "on-hold", "processing", "pending", "rejected"], {
    message:
      "Status must be one of: approved | on-hold | processing | pending | rejected",
  }),

  description: z.string().optional(),

  note: z.string().optional(),
});
