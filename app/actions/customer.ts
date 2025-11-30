"use server";

import { asyncHandler } from "@/lib/utils";
import {
  createCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
} from "@/lib/services/customerService";
import { Customer } from "@/lib/types/customer";

export async function getCustomerListAction(
  page: number = 0,
  limit: number = 0,
  search?: string
) {
  return asyncHandler(async () => {
    const data = await listCustomers(page, limit, search);
    return JSON.parse(JSON.stringify(data));
  }, "Customers fetched");
}

export async function getCustomerByIdAction(id: string) {
  return asyncHandler(async () => {
    const data = await getCustomer(id);
    return JSON.parse(JSON.stringify(data));
  }, "Customer fetched");
}

export async function createCustomerAction(values: {
  name: string;
  phoneNumber: string;
  aadharNumber?: string;
}) {
  return asyncHandler(async () => {
    const data = await createCustomer({
      name: values.name,
      phoneNumber: values.phoneNumber,
      aadharNumber: values.aadharNumber || undefined,
    });
    return JSON.parse(JSON.stringify(data));
  }, "Customer created");
}

export async function updateCustomerAction(
  id: string,
  values: {
    name: string;
    phoneNumber: string;
    aadharNumber?: string;
  }
) {
  return asyncHandler(async () => {
    // Update customer logic to be implemented
    const data = await updateCustomer(id, {
      name: values.name,
      phoneNumber: values.phoneNumber,
      aadharNumber: values.aadharNumber || undefined,
    });
    return JSON.parse(JSON.stringify(data));
  }, "Customer updated");
}
