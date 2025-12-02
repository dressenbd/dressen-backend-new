import axios from "axios";
import { pathaoConfig } from "../../config/pathao.config";
import * as tokenService from "./pathao.token.service";
import AppError from "../../errors/handleAppError";
import httpStatus from "http-status";

const client = axios.create({
  baseURL: pathaoConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 1️⃣ Issue Access Token
export const issueToken = async () => {
  try {
    const { data } = await client.post("/issue-token", {
      client_id: pathaoConfig.clientId,
      client_secret: pathaoConfig.clientSecret,
      grant_type: "password",
      username: pathaoConfig.username,
      password: pathaoConfig.password,
    });
    
    await tokenService.saveTokens(data.access_token, data.refresh_token, data.expires_in);
    return data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, `Pathao token issue failed: ${error.response?.data?.message || error.message}`);
  }
};

// ✅ 2️⃣ Refresh Access Token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "No refresh token available");
    }
    const { data } = await client.post("/issue-token", {
      client_id: pathaoConfig.clientId,
      client_secret: pathaoConfig.clientSecret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    await tokenService.saveTokens(data.access_token, data.refresh_token, data.expires_in);
    return data;
  } catch (error: any) {
    await tokenService.clearTokens();
    throw new AppError(httpStatus.UNAUTHORIZED, `Token refresh failed: ${error.response?.data?.message || error.message}`);
  }
};

// Helper to get valid token
const getValidToken = async (): Promise<string> => {
  let token = await tokenService.getAccessToken();
  if (!token) {
    await issueToken();
    token = await tokenService.getAccessToken();
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Failed to generate access token');
    }
  }
  return token;
};

// ✅ 3️⃣ Create Store
export const createStore = async (storeData: any) => {
  try {
    const token = await getValidToken();
    const { data } = await client.post("/stores", storeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      const token = await getValidToken();
      const { data } = await client.post("/stores", storeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    }
    
    const errorMsg = error.response?.data?.errors ? 
      JSON.stringify(error.response.data.errors) : 
      error.response?.data?.message || error.message;
    
    throw new AppError(httpStatus.BAD_REQUEST, `Store creation failed: ${errorMsg}`);
  }
};

// ✅ 4️⃣ Create Order
export const createOrder = async (orderData: any) => {
  try {
    const token = await getValidToken();
    const { data } = await client.post("/orders", orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      const token = await getValidToken();
      const { data } = await client.post("/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    }
    throw new AppError(httpStatus.BAD_REQUEST, `Order creation failed: ${error.response?.data?.message || error.message}`);
  }
};

// ✅ 5️⃣ Create Bulk Order (Fixed: Individual requests)
export const bulkCreateOrders = async (orders: any[]) => {
  const results: { successful: number; failed: number; orders: any[]; errors: string[] } = { 
    successful: 0, 
    failed: 0, 
    orders: [], 
    errors: [] 
  };
  
  for (const orderData of orders) {
    try {
      const result = await createOrder(orderData);
      results.successful++;
      results.orders.push(result);
    } catch (error: any) {
      results.failed++;
      results.errors.push(`Order failed: ${error.message}`);
    }
  }
  
  return results;
};

// ✅ 6️⃣ Get Order Info (Fixed endpoint)
export const getOrderInfo = async (consignmentId: string) => {
  try {
    const token = await getValidToken();
    const { data } = await client.get(`/orders/${consignmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      const token = await getValidToken();
      const { data } = await client.get(`/orders/${consignmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    }
    throw new AppError(httpStatus.BAD_REQUEST, `Order info fetch failed: ${error.response?.data?.message || error.message}`);
  }
};

// ✅ 7️⃣ Get City List
export const getCityList = async () => {
  try {
    const token = await getValidToken();
    const { data } = await client.get("/city-list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      const token = await getValidToken();
      const { data } = await client.get("/city-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    }
    throw new AppError(httpStatus.BAD_REQUEST, `City list fetch failed: ${error.response?.data?.message || error.message}`);
  }
};

// ✅ 8️⃣ Get Zone List
export const getZoneList = async (cityId: number) => {
  try {
    const token = await getValidToken();
    const { data } = await client.get(`/cities/${cityId}/zone-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      const token = await getValidToken();
      const { data } = await client.get(`/cities/${cityId}/zone-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    }
    throw new AppError(httpStatus.BAD_REQUEST, `Zone list fetch failed: ${error.response?.data?.message || error.message}`);
  }
};

// ✅ 9️⃣ Get Area List
export const getAreaList = async (zoneId: number) => {
  try {
    const token = await getValidToken();
    const { data } = await client.get(`/zones/${zoneId}/area-list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      const token = await getValidToken();
      const { data } = await client.get(`/zones/${zoneId}/area-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    }
    throw new AppError(httpStatus.BAD_REQUEST, `Area list fetch failed: ${error.response?.data?.message || error.message}`);
  }
};

// ✅ 🔟 Price Calculation
export const calculatePrice = async (priceData: any) => {
  try {
    const token = await getValidToken();
    const { data } = await client.post("/merchant/price-plan", priceData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      const token = await getValidToken();
      const { data } = await client.post("/merchant/price-plan", priceData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    }
    throw new AppError(httpStatus.BAD_REQUEST, `Price calculation failed: ${error.response?.data?.message || error.message}`);
  }
};

// ✅ 1️⃣1️⃣ Get Store List
export const getStoreList = async () => {
  try {
    const token = await getValidToken();
    const { data } = await client.get("/stores", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      await refreshAccessToken();
      const token = await getValidToken();
      const { data } = await client.get("/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    }
    throw new AppError(httpStatus.BAD_REQUEST, `Store list fetch failed: ${error.response?.data?.message || error.message}`);
  }
};
