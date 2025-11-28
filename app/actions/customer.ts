"use server";

import { asyncHandler } from "@/lib/utils";
import { createCustomer, listCustomers } from "@/lib/services/customerService";

export async function getCustomerListAction() {
  return asyncHandler(async () => {
    const data = await listCustomers();
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
