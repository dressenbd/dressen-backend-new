export type TCoupon = {
  image?: string;
  code: string;
  description?: string;
  type: "fixed" | "percentage" | "free-shipping";
  discountAmount: number;
  minimumPurchaseAmount: number;
  isVerifiedCustomer?: boolean;
  isApproved?: boolean;
  activeDate?: Date;
  expireDate: Date;
};
