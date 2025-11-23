import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/lib/utils";
import { getJob, updateJob, deleteJob } from "@/lib/services/jobService";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await asyncHandler(() => getJob(params.id), "Job fetched");
  return NextResponse.json(result, { status: result.code });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const result = await asyncHandler(
    () => updateJob(params.id, body),
    "Job updated"
  );
  return NextResponse.json(result, { status: result.code });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await asyncHandler(() => deleteJob(params.id), "Job deleted");
  return NextResponse.json(result, { status: result.code });
}
