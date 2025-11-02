import axios from "axios";
import { steadfastConfig } from "../../config/steadfast.config";

const client = axios.create({
  baseURL: steadfastConfig.baseURL,
  headers: {
    "Api-Key": steadfastConfig.apiKey,
    "Secret-Key": steadfastConfig.secretKey,
    "Content-Type": "application/json",
  },
});

// ✅ 1️⃣ Create single order
export const createOrder = async (orderData: any) => {
  const { data } = await client.post("/create_order", orderData);
  return data;
};

// ✅ 2️⃣ Bulk order creation (max 500)
export const bulkCreateOrders = async (orders: any[]) => {
  const payload = { data: orders };
  const { data } = await client.post("/create_order/bulk-order", payload);
  return data;
};

// ✅ 3️⃣ Check delivery status (by consignment ID)
export const getStatusByConsignmentId = async (id: string | number) => {
  const { data } = await client.get(`/status_by_cid/${id}`);
  return data;
};

// ✅ 4️⃣ Check delivery status (by invoice)
export const getStatusByInvoice = async (invoice: string) => {
  const { data } = await client.get(`/status_by_invoice/${invoice}`);
  return data;
};

// ✅ 5️⃣ Check delivery status (by tracking code)
export const getStatusByTrackingCode = async (trackingCode: string) => {
  const { data } = await client.get(`/status_by_trackingcode/${trackingCode}`);
  return data;
};

// ✅ 6️⃣ Get current balance
export const getCurrentBalance = async () => {
  const { data } = await client.get("/get_balance");
  return data;
};

// ✅ 7️⃣ Create return request
export const createReturnRequest = async (payload: {
  consignment_id?: number;
  invoice?: string;
  tracking_code?: string;
  reason?: string;
}) => {
  const { data } = await client.post("/create_return_request", payload);
  return data;
};

// ✅ 8️⃣ Get single return request
export const getReturnRequest = async (id: string | number) => {
  const { data } = await client.get(`/get_return_request/${id}`);
  return data;
};

// ✅ 9️⃣ Get all return requests
export const getReturnRequests = async () => {
  const { data } = await client.get("/get_return_requests");
  return data;
};
