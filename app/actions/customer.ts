"use server";

import { asyncHandler } from "@/lib/utils";
import { listCustomers } from "@/lib/services/customerService";

export async function getCustomers() {
  return asyncHandler(async () => {
    const data = await listCustomers();
    return JSON.parse(JSON.stringify(data));
  }, "Customers fetched");
}
