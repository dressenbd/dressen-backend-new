import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { promoCategoryServices } from "./promoCategory.service";

const createPromoCategory = catchAsync(async (req, res) => {
  const file = req.file;
  const body = req.body;
  
  const data: any = {
    name: body.name,
    description: body.description,
    isActive: body.isActive === "true" || body.isActive === true,
    startDate: body.startDate,
    endDate: body.endDate,
  };
  
  if (file) data.image = file.path;

  const result = await promoCategoryServices.createPromoCategoryOnDB(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Promo category created successfully!",
    data: result,
  });
});

const getAllPromoCategories = catchAsync(async (req, res) => {
  const result = await promoCategoryServices.getAllPromoCategoriesFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Promo categories retrieved successfully!",
    data: result,
  });
});

const getActivePromoCategories = catchAsync(async (req, res) => {
  const result = await promoCategoryServices.getActivePromoCategoriesFromDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Active promo categories retrieved successfully!",
    data: result,
  });
});

const getPromoCategoryById = catchAsync(async (req, res) => {
  const result = await promoCategoryServices.getPromoCategoryByIdFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Promo category retrieved successfully!",
    data: result,
  });
});

const updatePromoCategory = catchAsync(async (req, res) => {
  const file = req.file;
  const body = req.body;
  
  const data: any = {};
  
  if (body.name) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.isActive !== undefined) data.isActive = body.isActive === "true" || body.isActive === true;
  if (body.startDate) data.startDate = body.startDate;
  if (body.endDate) data.endDate = body.endDate;
  if (file) data.image = file.path;

  const result = await promoCategoryServices.updatePromoCategoryOnDB(req.params.id, data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Promo category updated successfully!",
    data: result,
  });
});

const deletePromoCategory = catchAsync(async (req, res) => {
  const result = await promoCategoryServices.deletePromoCategoryFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Promo category deleted successfully!",
    data: result,
  });
});

export const promoCategoryControllers = {
  createPromoCategory,
  getAllPromoCategories,
  getActivePromoCategories,
  getPromoCategoryById,
  updatePromoCategory,
  deletePromoCategory,
};
