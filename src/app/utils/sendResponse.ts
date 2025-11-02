import { Response } from "express";

interface TMeta {
  total: number;
}

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: TMeta;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  // Set the status code and send the response
  res.status(data?.statusCode || 200).json({
    success: data?.success || true,
    message: data?.message || "Success",
    meta: data.meta,
    data: data?.data || null,
  });
};

export default sendResponse;
