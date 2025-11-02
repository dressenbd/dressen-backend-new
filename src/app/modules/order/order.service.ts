import httpStatus from "http-status";
import { nanoid } from "nanoid";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import { ProductModel } from "../product/product.model";
import { UserModel } from "../user/user.model";
import { OrderSearchableFields } from "./order.consts";
import { TOrder } from "./order.interface";
import { OrderModel } from "./order.model";

type OrderStatus =
  | "pending"
  | "processing"
  | "at-local-facility"
  | "delivered"
  | "cancelled"
  | "paid";

/**
 * ✅ Helper: Common populate configuration for all order queries
 */
const orderPopulateOptions = [
  {
    path: "orderBy", // ✅ Root-level field
    select: "name email",
  },
  {
    path: "orderInfo.productInfo", // ✅ Inside orderInfo array
    select:
      "description.name productInfo.price productInfo.salePrice productInfo.wholesalePrice featuredImg",
  },
  {
    path: "orderInfo.products.product", // ✅ products[] inside orderInfo[]
    select:
      "description.name productInfo.price productInfo.salePrice productInfo.wholesalePrice featuredImg",
  },
];

/**
 * ✅ Get All Orders
 */
const getAllOrdersFromDB = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    OrderModel.find().populate(orderPopulateOptions),
    query
  )
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  // ✅ Execute main query for product data
  const data = await orderQuery.modelQuery;

  // ✅ Use built-in countTotal() from QueryBuilder
  const meta = await orderQuery.countTotal();

  return {
    meta,
    data,
  };
};

/**
 * ✅ Get My Orders (for logged-in user)
 */
const getMyOrdersFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const orderQuery = new QueryBuilder(
    OrderModel.find({ orderBy: userId }).populate(orderPopulateOptions),
    query
  )
    .search(OrderSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  // ✅ Execute main query for product data
  const data = await orderQuery.modelQuery;

  // ✅ Use built-in countTotal() from QueryBuilder
  const meta = await orderQuery.countTotal();

  return {
    meta,
    data,
  };
};

/**
 * ✅ Get Single Order by ID
 */
const getSingleOrderFromDB = async (id: string) => {
  const result = await OrderModel.findById(id).populate(orderPopulateOptions);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Order does not exist!");
  }

  return result;
};

// 🔹 Get Commission Summary for a User

const getUserCommissionSummaryFromDB = async (userId: string) => {
  // ✅ Fetch all orders placed by the user
  const orders = await OrderModel.find({
    orderBy: userId,
    status: "paid",
  }).populate([
    {
      path: "orderInfo.productInfo",
      select:
        "productInfo.price productInfo.salePrice productInfo.retailPrice productInfo.wholeSalePrice productInfo.wholesalePrice description.name",
    },
    {
      path: "orderInfo.products.product",
      select:
        "productInfo.price productInfo.salePrice productInfo.retailPrice productInfo.wholeSalePrice productInfo.wholesalePrice description.name",
    },
  ]);

  if (!orders || orders.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No orders found for this user");
  }

  let totalOrders = 0;
  let completedOrders = 0;
  let pendingOrders = 0;
  let totalQuantity = 0;

  let totalPercentageCommissionAmount = 0;
  let totalFixedCommissionAmount = 0;
  let totalPercentageRate = 0;
  let percentageCommissionCount = 0;

  let totalSaleAmount = 0;
  let totalRetailAmount = 0;
  let totalWholesaleAmount = 0;

  // ===== Helper functions =====
  const getSalePriceFromProduct = (prod: any) => {
    const sale = prod?.productInfo?.salePrice;
    const price = prod?.productInfo?.price;
    if (typeof sale === "number" && sale > 0) return sale;
    if (typeof price === "number") return price;
    return 0;
  };

  const getRetailPriceFromProduct = (prod: any) => {
    const retail = prod?.productInfo?.retailPrice;
    return typeof retail === "number" && retail > 0 ? retail : 0;
  };

  const getWholesalePriceFromProduct = (prod: any) => {
    const w1 = prod?.productInfo?.wholeSalePrice;
    const w2 = prod?.productInfo?.wholesalePrice;
    if (typeof w1 === "number" && w1 > 0) return w1;
    if (typeof w2 === "number" && w2 > 0) return w2;
    return 0;
  };

  // ===== Loop through all orders =====
  for (const order of orders) {
    totalOrders++;

    if (order.status === "paid") {
      completedOrders++;
    } else if (order.status === "pending") {
      pendingOrders++;
    }

    // Loop through orderInfo array for detailed calculation
    for (const info of order.orderInfo) {
      const qty = info.quantity || 1;
      totalQuantity += qty;

      // ✅ Handle single product
      if (info.productInfo) {
        const prod = info.productInfo as any;

        const salePrice = getSalePriceFromProduct(prod);
        const retailPrice = getRetailPriceFromProduct(prod);
        const wholesalePrice = getWholesalePriceFromProduct(prod);

        totalSaleAmount += salePrice * qty;
        totalRetailAmount += retailPrice * qty;
        totalWholesaleAmount += wholesalePrice * qty;
      }

      // ✅ Handle multiple products
      if (Array.isArray(info.products) && info.products.length > 0) {
        for (const p of info.products) {
          const prod = (p as any).product as any;
          const pq = (p as any).quantity || 1;
          totalQuantity += pq;

          const usedSalePrice =
            typeof (p as any).price === "number" && (p as any).price > 0
              ? (p as any).price
              : getSalePriceFromProduct(prod);

          const retailPrice =
            typeof (p as any).retailPrice === "number" &&
            (p as any).retailPrice > 0
              ? (p as any).retailPrice
              : getRetailPriceFromProduct(prod);

          const wholesalePrice =
            typeof (p as any).wholesalePrice === "number" &&
            (p as any).wholesalePrice > 0
              ? (p as any).wholesalePrice
              : getWholesalePriceFromProduct(prod);

          totalSaleAmount += usedSalePrice * pq;
          totalRetailAmount += retailPrice * pq;
          totalWholesaleAmount += wholesalePrice * pq;
        }
      }

      // ✅ Commission calculation
      if (info.commission?.type === "percentage") {
        const commissionAmount = info.commission.amount || 0;
        totalPercentageCommissionAmount += commissionAmount;
        totalPercentageRate += info.commission.value || 0;
        percentageCommissionCount++;
      } else if (info.commission?.type === "fixed") {
        const commissionAmount = info.commission.amount || 0;
        totalFixedCommissionAmount += commissionAmount;
      }
    }
  }

  const averagePercentageRate =
    percentageCommissionCount > 0
      ? totalPercentageRate / percentageCommissionCount
      : 0;

  const totalCommission =
    totalPercentageCommissionAmount + totalFixedCommissionAmount;

  return {
    totalOrders,
    completedOrders,
    pendingOrders,
    totalQuantity,
    totalCommission,
    totalPercentageCommissionAmount,
    totalFixedCommissionAmount,
    averagePercentageRate,
    totalSaleAmount,
    totalRetailAmount,
    totalWholesaleAmount,
  };
};

/**
 * ✅ Get Overall Order Summary (based on new Order Schema)
 * - Root-level: orderBy, userRole, status, totalAmount
 * - Nested: orderInfo[].totalAmount.total (for product-level totals)
 */
// const getOrderSummaryFromDB = async () => {
//   // Step 1️⃣: Aggregate top-level order stats
//   const rootSummary = await OrderModel.aggregate([
//     {
//       $group: {
//         _id: null,
//         totalOrders: { $sum: 1 },
//         pendingOrders: {
//           $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
//         },
//         paidOrders: {
//           $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
//         },
//         totalCancelledOrders: {
//           $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
//         },
//         srCanceledOrders: {
//           $sum: {
//             $cond: [
//               {
//                 $and: [
//                   { $eq: ["$status", "cancelled"] },
//                   { $eq: ["$userRole", "sr"] },
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },
//         customerCanceledOrders: {
//           $sum: {
//             $cond: [
//               {
//                 $and: [
//                   { $eq: ["$status", "cancelled"] },
//                   { $eq: ["$userRole", "customer"] },
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },
//         todayTotalPaidOrders: {
//           $sum: {
//             $cond: [
//               {
//                 $and: [
//                   { $eq: ["$status", "paid"] },
//                   {
//                     $eq: [
//                       {
//                         $dateToString: {
//                           format: "%Y-%m-%d",
//                           date: "$createdAt",
//                         },
//                       },
//                       new Date().toISOString().split("T")[0],
//                     ],
//                   },
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },
//         todayTotalCanceledOrders: {
//           $sum: {
//             $cond: [
//               {
//                 $and: [
//                   { $eq: ["$status", "cancelled"] },
//                   {
//                     $eq: [
//                       {
//                         $dateToString: {
//                           format: "%Y-%m-%d",
//                           date: "$createdAt",
//                         },
//                       },
//                       new Date().toISOString().split("T")[0],
//                     ],
//                   },
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },
//         todayTotalSrOrders: {
//           $sum: {
//             $cond: [
//               {
//                 $and: [
//                   { $eq: ["$userRole", "sr"] },
//                   {
//                     $eq: [
//                       {
//                         $dateToString: {
//                           format: "%Y-%m-%d",
//                           date: "$createdAt",
//                         },
//                       },
//                       new Date().toISOString().split("T")[0],
//                     ],
//                   },
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },
//         todayTotalCustomerOrders: {
//           $sum: {
//             $cond: [
//               {
//                 $and: [
//                   { $eq: ["$userRole", "customer"] },
//                   {
//                     $eq: [
//                       {
//                         $dateToString: {
//                           format: "%Y-%m-%d",
//                           date: "$createdAt",
//                         },
//                       },
//                       new Date().toISOString().split("T")[0],
//                     ],
//                   },
//                 ],
//               },
//               1,
//               0,
//             ],
//           },
//         },
//         customerOrders: {
//           $sum: { $cond: [{ $eq: ["$userRole", "customer"] }, 1, 0] },
//         },
//         srOrders: {
//           $sum: { $cond: [{ $eq: ["$userRole", "sr"] }, 1, 0] },
//         },
//         totalOrderSaleAmount: {
//           $sum: { $ifNull: ["$totalAmount", 0] },
//         },
//         totalPendingSale: {
//           $sum: {
//             $cond: [
//               { $eq: ["$status", "pending"] },
//               { $ifNull: ["$totalAmount", 0] },
//               0,
//             ],
//           },
//         },
//         totalPaidOrderSaleAmount: {
//           $sum: {
//             $cond: [
//               { $eq: ["$status", "paid"] },
//               { $ifNull: ["$totalAmount", 0] },
//               0,
//             ],
//           },
//         },
//       },
//     },
//   ]);

//   // Step 2️⃣: Aggregate nested product-level orderInfo totals (for accuracy)
//   const nestedSummary = await OrderModel.aggregate([
//     { $unwind: "$orderInfo" },
//     {
//       $group: {
//         _id: null,
//         totalItemsSold: { $sum: "$orderInfo.quantity" },
//         totalProductSale: {
//           $sum: { $ifNull: ["$orderInfo.totalAmount.total", 0] },
//         },
//       },
//     },
//   ]);

//   // Step 3️⃣: Combine both safely
//   return {
//     totalOrders: rootSummary[0]?.totalOrders || 0,
//     pendingOrders: rootSummary[0]?.pendingOrders || 0,
//     paidOrders: rootSummary[0]?.paidOrders || 0,
//     customerOrders: rootSummary[0]?.customerOrders || 0,
//     canceledOrders: rootSummary[0]?.totalCancelledOrders || 0,
//     srCanceledOrders: rootSummary[0]?.srCanceledOrders || 0,
//     customerCanceledOrders: rootSummary[0]?.customerCanceledOrders || 0,
//     todayTotalPaidOrders: rootSummary[0]?.todayTotalPaidOrders || 0,
//     todayTotalCanceledOrders: rootSummary[0]?.todayTotalCanceledOrders || 0,
//     todayTotalSrOrders: rootSummary[0]?.todayTotalSrOrders || 0,
//     todayTotalCustomerOrders: rootSummary[0]?.todayTotalCustomerOrders || 0,
//     srOrders: rootSummary[0]?.srOrders || 0,
//     totalOrderSaleAmount: rootSummary[0]?.totalOrderSaleAmount || 0,
//     totalPendingSale: rootSummary[0]?.totalPendingSale || 0,
//     totalPaidOrderSaleAmount: rootSummary[0]?.totalPaidOrderSaleAmount || 0,
//     totalItemsSold: nestedSummary[0]?.totalItemsSold || 0,
//     totalProductSale: nestedSummary[0]?.totalProductSale || 0,
//   };
// };

const getOrderSummaryFromDB = async ({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}) => {
  try {
    // ✅ Convert and validate date range
    const start =
      startDate && !isNaN(new Date(startDate).getTime())
        ? new Date(startDate)
        : new Date(0);
    const end =
      endDate && !isNaN(new Date(endDate).getTime())
        ? new Date(endDate)
        : new Date();

    // ✅ Step 0️⃣: Apply timezone-safe date filter
    const matchStage = {
      $match: {
        createdAt: { $gte: start, $lte: end },
      },
    };

    // ✅ Step 1️⃣: Project date in Asia/Dhaka timezone
    const projectStage = {
      $addFields: {
        createdDate: {
          $dateToString: {
            date: "$createdAt",
            format: "%Y-%m-%d",
            timezone: "Asia/Dhaka",
          },
        },
      },
    };

    // ✅ Step 2️⃣: Apply date filter conditionally
    const dateFilterStage =
      startDate || endDate
        ? {
            $match: {
              createdDate: {
                $gte: startDate ? startDate : "1970-01-01",
                $lte: endDate ? endDate : "2100-12-31",
              },
            },
          }
        : null;

    // ✅ Step 3️⃣: Root-level aggregation
    const rootSummary = await OrderModel.aggregate([
      projectStage,
      ...(dateFilterStage ? [dateFilterStage] : []),
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          paidOrders: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
          },
          totalCancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
          srCanceledOrders: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "cancelled"] },
                    { $eq: ["$userRole", "sr"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          customerCanceledOrders: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "cancelled"] },
                    { $eq: ["$userRole", "customer"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          todayTotalPaidOrders: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "paid"] },
                    {
                      $eq: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: "Asia/Dhaka",
                          },
                        },
                        new Date().toISOString().split("T")[0],
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          todayTotalCanceledOrders: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "cancelled"] },
                    {
                      $eq: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: "Asia/Dhaka",
                          },
                        },
                        new Date().toISOString().split("T")[0],
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          todayTotalSrOrders: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$userRole", "sr"] },
                    {
                      $eq: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: "Asia/Dhaka",
                          },
                        },
                        new Date().toISOString().split("T")[0],
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          todayTotalCustomerOrders: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$userRole", "customer"] },
                    {
                      $eq: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                            timezone: "Asia/Dhaka",
                          },
                        },
                        new Date().toISOString().split("T")[0],
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          customerOrders: {
            $sum: { $cond: [{ $eq: ["$userRole", "customer"] }, 1, 0] },
          },
          srOrders: {
            $sum: { $cond: [{ $eq: ["$userRole", "sr"] }, 1, 0] },
          },
          totalOrderSaleAmount: {
            $sum: { $ifNull: ["$totalAmount", 0] },
          },
          totalPendingSale: {
            $sum: {
              $cond: [
                { $eq: ["$status", "pending"] },
                { $ifNull: ["$totalAmount", 0] },
                0,
              ],
            },
          },
          totalPaidOrderSaleAmount: {
            $sum: {
              $cond: [
                { $eq: ["$status", "paid"] },
                { $ifNull: ["$totalAmount", 0] },
                0,
              ],
            },
          },
        },
      },
    ]);

    // ✅ Step 4️⃣: Nested product-level summary
    const nestedSummary = await OrderModel.aggregate([
      projectStage,
      ...(dateFilterStage ? [dateFilterStage] : []),
      { $unwind: { path: "$orderInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalItemsSold: { $sum: { $ifNull: ["$orderInfo.quantity", 0] } },
          totalProductSale: {
            $sum: { $ifNull: ["$orderInfo.totalAmount.total", 0] },
          },
        },
      },
    ]);

    // ✅ Step 5️⃣: Combine all results
    return {
      totalOrders: rootSummary[0]?.totalOrders || 0,
      pendingOrders: rootSummary[0]?.pendingOrders || 0,
      paidOrders: rootSummary[0]?.paidOrders || 0,
      canceledOrders: rootSummary[0]?.totalCancelledOrders || 0,
      srCanceledOrders: rootSummary[0]?.srCanceledOrders || 0,
      customerCanceledOrders: rootSummary[0]?.customerCanceledOrders || 0,
      todayTotalPaidOrders: rootSummary[0]?.todayTotalPaidOrders || 0,
      todayTotalCanceledOrders: rootSummary[0]?.todayTotalCanceledOrders || 0,
      todayTotalSrOrders: rootSummary[0]?.todayTotalSrOrders || 0,
      todayTotalCustomerOrders: rootSummary[0]?.todayTotalCustomerOrders || 0,
      customerOrders: rootSummary[0]?.customerOrders || 0,
      srOrders: rootSummary[0]?.srOrders || 0,
      totalOrderSaleAmount: rootSummary[0]?.totalOrderSaleAmount || 0,
      totalPendingSale: rootSummary[0]?.totalPendingSale || 0,
      totalPaidOrderSaleAmount: rootSummary[0]?.totalPaidOrderSaleAmount || 0,
      totalItemsSold: nestedSummary[0]?.totalItemsSold || 0,
      totalProductSale: nestedSummary[0]?.totalProductSale || 0,
    };
  } catch (error) {
    console.error("Order Summary Error:", error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      paidOrders: 0,
      canceledOrders: 0,
      srCanceledOrders: 0,
      customerCanceledOrders: 0,
      todayTotalPaidOrders: 0,
      todayTotalCanceledOrders: 0,
      todayTotalSrOrders: 0,
      todayTotalCustomerOrders: 0,
      customerOrders: 0,
      srOrders: 0,
      totalOrderSaleAmount: 0,
      totalPendingSale: 0,
      totalPaidOrderSaleAmount: 0,
      totalItemsSold: 0,
      totalProductSale: 0,
    };
  }
};

const createOrderIntoDB = async (payload: TOrder) => {
  if (payload) {
    let totalQuantity = 0;

    // 🔹 Generate tracking number for the whole order
    payload.trackingNumber = nanoid();

    // 🔹 Default role
    if (!payload.userRole) {
      payload.userRole = "customer";
    }

    // 🔹 Loop through orderInfo array for calculations
    payload.orderInfo.forEach((item) => {
      // ✅ Default selectedPrice
      if (item.selectedPrice === undefined || item.selectedPrice === null) {
        item.selectedPrice = 0;
      }

      // ✅ Sum up total quantity
      totalQuantity += item.quantity || 0;

      // ✅ Commission calculation
      if (item.commission && item.totalAmount) {
        if (item.commission.type === "percentage") {
          item.commission.amount =
            (item.totalAmount.total * item.commission.value) / 100;
        } else if (item.commission.type === "fixed") {
          item.commission.amount = item.commission.value;
        }
      }
    });

    // ✅ Assign computed total quantity to main order
    payload.totalQuantity = totalQuantity;
  }

  // ✅ Save the order
  const result = await OrderModel.create(payload);
  return result;
};

const updateOrderInDB = async (id: string, payload: Partial<TOrder>) => {
  const isExist = await OrderModel.findById(id);

  if (!isExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Order does not exists!");
  }

  const result = await OrderModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

//  Update Order Status (Dedicated Route)

const updateOrderStatusInDB = async (id: string, status: OrderStatus) => {
  const order = await OrderModel.findById(id).populate("orderInfo.productInfo");

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found!");
  }

  const prevStatus = order.status;
  order.status = status;

  // ✅ When order is PAID — reduce product stock
  if (status === "paid" && prevStatus !== "paid") {
    for (const item of order.orderInfo) {
      const product = item.productInfo as any;

      if (product && product.productInfo) {
        const orderQty = item.quantity || 0;
        const currentQty = product.productInfo.quantity || 0;

        if (orderQty <= 0) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Invalid order quantity for "${
              product.description?.name || product.name
            }".`
          );
        }

        if (currentQty < orderQty) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Not enough stock for "${
              product.description?.name || product.name
            }". Only ${currentQty} left.`
          );
        }

        // 🟢 Deduct stock
        const newQty = currentQty - orderQty;
        await ProductModel.findByIdAndUpdate(product._id, {
          "productInfo.quantity": newQty,
        });

        // 💰 Calculate commission amount if needed
        if (
          item.commission &&
          !item.commission.amount &&
          item.commission.value
        ) {
          if (item.commission.type === "percentage") {
            item.commission.amount =
              (item.totalAmount.total * item.commission.value) / 100;
          } else {
            item.commission.amount = item.commission.value;
          }
        }
      }
    }

    // ✅ Add SR commission to user balance
    if (order.userRole === "sr" && order.orderBy && order.orderInfo.length) {
      let totalCommission = 0;

      order.orderInfo.forEach((item) => {
        if (item.commission?.amount) {
          totalCommission += item.commission.amount;
        }
      });

      if (totalCommission > 0) {
        await UserModel.findByIdAndUpdate(
          order.orderBy,
          { $inc: { commissionBalance: totalCommission } },
          { new: true }
        );
      }
    }
  }

  // 🔄 When order is CANCELLED — restore product stock
  if (status === "cancelled" && prevStatus === "paid") {
    for (const item of order.orderInfo) {
      const product = item.productInfo as any;

      if (product && product.productInfo) {
        const orderQty = item.quantity || 0;
        const currentQty = product.productInfo.quantity || 0;

        // 🟢 Restore stock
        const newQty = currentQty + orderQty;
        await ProductModel.findByIdAndUpdate(product._id, {
          "productInfo.quantity": newQty,
        });
      }
    }

    // 🔻 Optionally deduct commission if already credited
    if (order.userRole === "sr" && order.orderBy && order.orderInfo.length) {
      let totalCommission = 0;
      order.orderInfo.forEach((item) => {
        if (item.commission?.amount) {
          totalCommission += item.commission.amount;
        }
      });

      if (totalCommission > 0) {
        await UserModel.findByIdAndUpdate(
          order.orderBy,
          { $inc: { commissionBalance: -totalCommission } },
          { new: true }
        );
      }
    }
  }

  await order.save();
  return order;
};

export const orderServices = {
  getAllOrdersFromDB,
  getSingleOrderFromDB,
  getUserCommissionSummaryFromDB,
  createOrderIntoDB,
  updateOrderStatusInDB,
  getOrderSummaryFromDB,
  updateOrderInDB,
  getMyOrdersFromDB,
};
