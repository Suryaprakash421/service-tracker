"use server";

import { asyncHandler } from "@/lib/utils";
import { createCustomer, listCustomers } from "@/lib/services/customerService";

export async function getCustomerListAction(
  page: number = 0,
  limit: number = 0,
  search?: string
) {
  return asyncHandler(async () => {
    console.log("Fetching customers with search:", search);
    const data = await listCustomers(page, limit, search);
    return JSON.parse(JSON.stringify(data));
  }, "Customers fetched");
}

export async function createCustomerAction(
  prevState: unknown,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const aadharNumber = formData.get("aadharNumber") as string;

  return asyncHandler(async () => {
    const data = await createCustomer({
      name,
      phoneNumber,
      aadharNumber: aadharNumber || undefined,
    });
    return JSON.parse(JSON.stringify(data));
  }, "Customer created");
}
