import dbConnect from "@/lib/db";
import Customer from "@/lib/model/Customer.model";

interface AppError extends Error {
  code?: number;
}

export interface CreateCustomerInput {
  name: string;
  phoneNumber: string;
  aadharNumber?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  phoneNumber?: string;
  aadharNumber?: string;
}

export async function createCustomer(data: CreateCustomerInput) {
  await dbConnect();
  const existing = await Customer.findOne({ phoneNumber: data.phoneNumber });
  if (existing) {
    const err: AppError = new Error(
      "Customer with this phone number already exists"
    );
    err.code = 409;
    throw err;
  }
  const doc = await Customer.create(data);
  return doc;
}

export async function listCustomers(
  page: number = 0,
  limit: number = 0,
  search?: string
) {
  await dbConnect();
  const query: Record<string, unknown> = {};
  const isPaginated = page > 0 && limit > 0;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } },
    ];
  }
  const skip = (page - 1) * limit;
  if (!isPaginated) {
    const [items, total] = await Promise.all([
      Customer.find(query).sort({ createdAt: -1 }),
      Customer.countDocuments(query),
    ]);
    return { items, total, page, pages: 1 };
  }
  const [items, total] = await Promise.all([
    Customer.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(query),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

export async function getCustomer(id: string) {
  await dbConnect();
  const doc = await Customer.findById(id);
  if (!doc) {
    const err: AppError = new Error("Customer not found");
    err.code = 404;
    throw err;
  }
  return doc;
}

export async function updateCustomer(id: string, data: UpdateCustomerInput) {
  await dbConnect();
  const doc = await Customer.findByIdAndUpdate(id, data, { new: true });
  if (!doc) {
    const err: AppError = new Error("Customer not found");
    err.code = 404;
    throw err;
  }
  return doc;
}

export async function deleteCustomer(id: string) {
  await dbConnect();
  const doc = await Customer.findByIdAndDelete(id);
  if (!doc) {
    const err: AppError = new Error("Customer not found");
    err.code = 404;
    throw err;
  }
  return { id }; // return minimal confirmation
}
