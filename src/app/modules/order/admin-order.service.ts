import { nanoid } from "nanoid";
import { Types } from "mongoose";
import { TOrder } from "./order.interface";
import { OrderModel } from "./order.model";
import { ProductModel } from "../product/product.model";
import { UserModel } from "../user/user.model";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";

export type OrderSource = "phone" | "walk-in" | "online" | "whatsapp" | "facebook";

export type AdminOrderPayload = TOrder & {
  orderSource: OrderSource;
  adminNotes?: string;
  customerType?: "new" | "existing" | "guest";
  assignedSR?: string; // ObjectId of SR if order is assigned
};

const createAdminOrderIntoDB = async (payload: AdminOrderPayload, adminUser: any) => {
  // Set admin as order creator
  payload.orderBy = adminUser._id;
  payload.userRole = "admin";
  
  // Generate tracking number
  payload.trackingNumber = `ADM-${nanoid(8)}`;
  
  // Set default status based on source
  if (!payload.status) {
    payload.status = payload.orderSource === "walk-in" ? "paid" : "pending";
  }

  // Calculate totals
  let totalQuantity = 0;
  let calculatedTotal = 0;

  payload.orderInfo.forEach((item) => {
    totalQuantity += item.quantity || 0;
    calculatedTotal += item.totalAmount.total || 0;

    // Set default shipping if not provided
    if (!item.totalAmount.shipping) {
      item.totalAmount.shipping = {
        name: "Standard",
        type: "free" as const
      };
    }

    // Admin commission calculation (if SR is assigned)
    if (payload.assignedSR && item.commission) {
      if (item.commission.type === "percentage") {
        item.commission.amount = (item.totalAmount.total * item.commission.value) / 100;
      } else {
        item.commission.amount = item.commission.value;
      }
    }
  });

  payload.totalQuantity = totalQuantity;
  payload.totalAmount = calculatedTotal;

  // Add admin metadata
  payload.adminMetadata = {
    createdBy: adminUser._id,
    orderSource: payload.orderSource,
    adminNotes: payload.adminNotes,
    customerType: payload.customerType || "guest",
    assignedSR: payload.assignedSR ? new Types.ObjectId(payload.assignedSR) : undefined,
  };

  const result = await OrderModel.create(payload);



  // If walk-in order (immediate payment), update stock
  if (payload.orderSource === "walk-in" && payload.status === "paid") {
    await updateProductStock(payload.orderInfo, "deduct");
  }

  return result;
};

const createBulkOrdersIntoDB = async (orders: AdminOrderPayload[], adminUser: any) => {
  const results = {
    successful: 0,
    failed: 0,
    errors: [] as string[],
    orders: [] as any[]
  };

  for (const orderData of orders) {
    try {
      const result = await createAdminOrderIntoDB(orderData, adminUser);
      results.successful++;
      results.orders.push(result);
    } catch (error) {
      results.failed++;
      results.errors.push(`Order ${orderData.customerInfo.fullName}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return results;
};

// Helper function to update product stock
const updateProductStock = async (orderInfo: any[], action: "deduct" | "restore") => {
  for (const item of orderInfo) {
    const product = await ProductModel.findById(item.productInfo);
    
    if (product && product.productInfo) {
      const orderQty = item.quantity || 0;
      const currentQty = product.productInfo.quantity || 0;
      
      let newQty: number;
      if (action === "deduct") {
        if (currentQty < orderQty) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Not enough stock for product. Only ${currentQty} left.`
          );
        }
        newQty = currentQty - orderQty;
      } else {
        newQty = currentQty + orderQty;
      }
      
      await ProductModel.findByIdAndUpdate(item.productInfo, {
        "productInfo.quantity": newQty,
      });
    }
  }
};

export const adminOrderServices = {
  createAdminOrderIntoDB,
  createBulkOrdersIntoDB,
};