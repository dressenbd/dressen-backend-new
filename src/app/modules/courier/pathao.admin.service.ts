import * as pathaoService from './pathao.service';
import { OrderModel } from '../order/order.model';
import AppError from '../../errors/handleAppError';
import httpStatus from 'http-status';

// Auto-create Pathao order when main order is confirmed
export const autoCreatePathaoOrder = async (orderId: string) => {
  const order = await OrderModel.findById(orderId).populate('customerInfo');
  
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  // Check if order is eligible for Pathao delivery
  if ((order as any).pathaoConsignmentId) {
    return null;
  }

  const pathaoOrderData = {
    store_id: 1, // Default store ID - should be configurable
    merchant_order_id: order.trackingNumber,
    recipient_name: order.customerInfo.fullName,
    recipient_phone: (order.customerInfo as any).phoneNumber || (order.customerInfo as any).phone,
    recipient_address: order.customerInfo.address,
    delivery_type: 48, // Normal delivery
    item_type: 2, // Parcel
    item_quantity: order.totalQuantity,
    item_weight: calculateOrderWeight(order),
    item_description: `Order ${order.trackingNumber}`,
    amount_to_collect: order.totalAmount,
  };

  try {
    const result = await pathaoService.createOrder(pathaoOrderData);
    
    // Update order with Pathao consignment ID
    await OrderModel.findByIdAndUpdate(orderId, {
      $set: {
        pathaoConsignmentId: result.data.consignment_id,
        courierService: 'pathao',
      }
    } as any);

    return result;
  } catch (error) {
    console.error('Auto Pathao order creation failed:', error);
    return null;
  }
};

// Calculate order weight (default 0.5kg per item)
const calculateOrderWeight = (order: any): number => {
  return Math.max(0.5, order.totalQuantity * 0.5);
};

// Sync Pathao order status with main order
export const syncPathaoOrderStatus = async (orderId: string) => {
  const order = await OrderModel.findById(orderId);
  
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }
  
  const pathaoConsignmentId = (order as any).pathaoConsignmentId;
  
  if (!pathaoConsignmentId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No Pathao consignment ID found');
  }

  try {
    const pathaoOrder = await pathaoService.getOrderInfo(pathaoConsignmentId);
    
    // Map Pathao status to our order status
    const statusMapping: Record<string, string> = {
      'Pickup_Request_Placed': 'processing',
      'Picked_Up': 'shipped',
      'In_Transit': 'shipped',
      'Delivered': 'delivered',
      'Cancelled': 'cancelled',
      'Returned': 'returned',
    };

    const newStatus = statusMapping[pathaoOrder.data.status] || order.status;
    
    if (newStatus !== order.status) {
      await OrderModel.findByIdAndUpdate(orderId, { status: newStatus });
    }

    return pathaoOrder;
  } catch (error) {
    console.error('Pathao status sync failed:', error);
    throw error;
  }
};

// Get delivery cost for order
export const getDeliveryCost = async (orderData: any) => {
  if (!orderData) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Order data is required');
  }
  
  const priceData = {
    store_id: 1, // Default store ID
    item_type: 2,
    delivery_type: 48,
    item_weight: calculateOrderWeight(orderData),
    recipient_city: orderData.cityId || 1,
    recipient_zone: orderData.zoneId || 298,
  };

  return await pathaoService.calculatePrice(priceData);
};