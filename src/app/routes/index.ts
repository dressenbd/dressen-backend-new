import express from "express";
import { AttributeRoutes } from "../modules/attributes/attributes.route";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BecomeSellerReviewRoutes } from "../modules/becomeSellerReview/becomeSellerReview.routes";
import { BrandRoutes } from "../modules/brands/brands.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { CouponRoutes } from "../modules/coupons/coupons.route";
import { CustomerRoutes } from "../modules/customer/customer.route";
import { DashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { FaqRoutes } from "../modules/faq/faq.route";
import { OrderRoutes } from "../modules/order/order.route";
import { OrderStatusRoutes } from "../modules/orderStatus/orderStatus.route";
import { ProductRoutes } from "../modules/product/product.routes";
import { SalesHistoryRoutes } from "../modules/salesHistory/salesHistory.routes";
import { settingsRoutes } from "../modules/settings/settings.routes";
import { ShippingRoutes } from "../modules/shipping/shipping.route";
import { ShopRoutes } from "../modules/shop/shop.route";
import { SummaryRoutes } from "../modules/summary/summary.route";
import { SuperAdminRoutes } from "../modules/super-admin/superAdmin.route";
import { TagRoutes } from "../modules/tags/tags.routes";
import { TaxRoutes } from "../modules/taxs/taxs.route";
import { TermsRoutes } from "../modules/terms/terms.route";
import { TransactionRoutes } from "../modules/transactions/transactions.route";
import { TransferRoutes } from "../modules/transfer/transfer.route";
import { UserRoutes } from "../modules/user/user.routes";
import { VendorRoutes } from "../modules/vendor/vendor.route";
import { WithdrawalRoutes } from "./../modules/withdrawals/withdrawals.routes";

import { steadfastRoutes } from "../modules/courier/steadfast.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/vendor",
    route: VendorRoutes,
  },
  {
    path: "/customer",
    route: CustomerRoutes,
  },
  {
    path: "/super-admin",
    route: SuperAdminRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/brand",
    route: BrandRoutes,
  },
  {
    path: "/tag",
    route: TagRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/coupon",
    route: CouponRoutes,
  },
  {
    path: "/transaction",
    route: TransactionRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/attribute",
    route: AttributeRoutes,
  },
  {
    path: "/shop",
    route: ShopRoutes,
  },
  {
    path: "/transfer",
    route: TransferRoutes,
  },
  {
    path: "/terms",
    route: TermsRoutes,
  },
  {
    path: "/tax",
    route: TaxRoutes,
  },
  {
    path: "/shipping",
    route: ShippingRoutes,
  },
  {
    path: "/faq",
    route: FaqRoutes,
  },
  {
    path: "/order-status",
    route: OrderStatusRoutes,
  },
  {
    path: "/summary",
    route: SummaryRoutes,
  },
  {
    path: "/sales-history",
    route: SalesHistoryRoutes,
  },
  {
    path: "/withdrawals",
    route: WithdrawalRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/become-seller-reviews",
    route: BecomeSellerReviewRoutes,
  },
  {
    path: "/settings",
    route: settingsRoutes,
  },
  {
    path: "/steadfast",
    route: steadfastRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route?.path, route?.route));

export default router;
