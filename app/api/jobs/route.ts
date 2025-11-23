import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "@/lib/utils";
import { createJob, listJobs } from "@/lib/services/jobService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const status = searchParams.get("status") || undefined;

  const result = await asyncHandler(
    () => listJobs(page, limit, status),
    "Jobs fetched"
  );
  return NextResponse.json(result, { status: result.code });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await asyncHandler(
    () => createJob(body),
    "Job created",
    201,
    "created"
  );
  return NextResponse.json(result, { status: result.code });
}
