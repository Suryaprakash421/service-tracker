import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/lib/utils";
import { createCustomer, listCustomers } from "@/lib/services/customerService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const search = searchParams.get("search") || undefined;

  const result = await asyncHandler(
    () => listCustomers(page, limit, search),
    "Customers fetched"
  );
  return NextResponse.json(result, { status: result.code });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await asyncHandler(
    () => createCustomer(body),
    "Customer created",
    201,
    "created"
  );
  return NextResponse.json(result, { status: result.code });
}
