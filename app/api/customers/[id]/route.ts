import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/lib/utils";
import {
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/services/customerService";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await asyncHandler(
    () => getCustomer(id),
    "Customer fetched"
  );
  return NextResponse.json(result, { status: result.code });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const result = await asyncHandler(
    () => updateCustomer(id, body),
    "Customer updated"
  );
  return NextResponse.json(result, { status: result.code });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await asyncHandler(
    () => deleteCustomer(id),
    "Customer deleted"
  );
  return NextResponse.json(result, { status: result.code });
}
