import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/handleAppError";
import { CustomerSearchableFields } from "./customer.const";
import { TCustomer } from "./customer.interface";
import { CustomerModel } from "./customer.model";

const customerPopulate = [
  { path: "userId" },
  { path: "cartItem.productInfo.productId" },
  { path: "wishlist" },
  { path: "orders.orderInfo" },
];

// Create Customer
const createCustomerOnDB = async (payload: TCustomer) => {
  const result = await CustomerModel.create(payload);
  return result.populate(customerPopulate);
};

// Get All Customers with filtering, searching, sorting, pagination
const getAllCustomerFromDB = async (query: Record<string, unknown>) => {
  const customerQuery = new QueryBuilder(
    CustomerModel.find().populate(customerPopulate),
    query
  )
    .search(CustomerSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await customerQuery.modelQuery;
  return result;
};

// Get Single Customer by ID
const getSingleCustomerFromDB = async (id: string) => {
  const result = await CustomerModel.findById(id).populate(customerPopulate);
  return result;
};

// ✅ Update Customer by ID
const updateCustomerOnDB = async (id: string, payload: Partial<TCustomer>) => {
  const result = await CustomerModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate(customerPopulate);

  return result;
};

const getMyCustomerInfoFromDB = async (id: string) => {
  const result = await CustomerModel.findOne({ userId: id }).populate(
    customerPopulate
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exists!");
  }
  return result;
};

const getWishlistFromDB = async (userId: string) => {
  const result = await CustomerModel.findOne({ userId }).populate({
    path: 'wishlist',
    select: 'description.name productInfo.price productInfo.salePrice featuredImg gallery productInfo.discount'
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Wrong userId!");
  }
  return result.wishlist;
};

const addToWishlistDB = async (userId: string, productId: string) => {
  // Check if customer exists first
  const existingCustomer = await CustomerModel.findOne({ userId });
  if (!existingCustomer) {
    throw new AppError(httpStatus.NOT_FOUND, "Wrong userId!");
  }
  
  // Check if product already in wishlist
  if (existingCustomer.wishlist.includes(productId as any)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product already exists in wishlist!");
  }
  
  const result = await CustomerModel.findOneAndUpdate(
    { userId },
    { $addToSet: { wishlist: productId } },
    { new: true }
  ).populate({
    path: 'wishlist',
    select: 'description.name productInfo.price productInfo.salePrice featuredImg gallery productInfo.discount'
  });
  
  return result!.wishlist;
};

const removeFromWishlistDB = async (userId: string, productId: string) => {
  // First check if customer exists and product is in wishlist
  const existingCustomer = await CustomerModel.findOne({ userId });
  if (!existingCustomer) {
    throw new AppError(httpStatus.NOT_FOUND, "Wrong userId!");
  }
  
  // Check if product exists in wishlist
  if (!existingCustomer.wishlist.includes(productId as any)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product not found in wishlist!");
  }
  
  const result = await CustomerModel.findOneAndUpdate(
    { userId },
    { $pull: { wishlist: productId } },
    { new: true }
  ).populate({
    path: 'wishlist',
    select: 'description.name productInfo.price productInfo.salePrice featuredImg gallery productInfo.discount'
  });
  
  return result!.wishlist;
};

const clearWishlistDB = async (userId: string) => {
  // Check if customer exists first
  const existingCustomer = await CustomerModel.findOne({ userId });
  if (!existingCustomer) {
    throw new AppError(httpStatus.NOT_FOUND, "Wrong userId!");
  }
  
  // Check if wishlist is already empty
  if (existingCustomer.wishlist.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wishlist is already empty!");
  }
  
  const result = await CustomerModel.findOneAndUpdate(
    { userId },
    { $set: { wishlist: [] } },
    { new: true }
  );
  
  return result!.wishlist;
};

export const customerServices = {
  createCustomerOnDB,
  getSingleCustomerFromDB,
  getAllCustomerFromDB,
  updateCustomerOnDB,
  getMyCustomerInfoFromDB,
  getWishlistFromDB,
  addToWishlistDB,
  removeFromWishlistDB,
  clearWishlistDB,
};
