import dbConnect from "@/lib/db";
import Job from "@/lib/model/Job";
import Customer from "@/lib/model/Customer";

interface AppError extends Error {
  code?: number;
}

export interface CreateJobInput {
  customer: string; // customer id
  deviceModel: string;
  problem: string;
  inventory?: {
    hasSimCard?: boolean;
    hasMemoryCard?: boolean;
    hasBackCover?: boolean;
  };
  additionalDetails?: string;
  status?: string; // enum validated by schema
}

export interface UpdateJobInput {
  deviceModel?: string;
  problem?: string;
  inventory?: {
    hasSimCard?: boolean;
    hasMemoryCard?: boolean;
    hasBackCover?: boolean;
  };
  additionalDetails?: string;
  status?: string;
}

export async function createJob(data: CreateJobInput) {
  await dbConnect();
  console.log("Creating job with data:", data);
  // Ensure customer exists
  const customer = await Customer.findById(data.customer);
  if (!customer) {
    const err: AppError = new Error("Customer not found for this job");
    err.code = 404;
    throw err;
  }
  const doc = await Job.create(data);
  return doc;
}

export async function listJobs(
  page: number = 1,
  limit: number = 20,
  status?: string
) {
  await dbConnect();
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Job.find(query)
      .populate("customer")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Job.countDocuments(query),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

export async function getJob(id: string) {
  await dbConnect();
  const doc = await Job.findById(id).populate("customer");
  if (!doc) {
    const err: AppError = new Error("Job not found");
    err.code = 404;
    throw err;
  }
  return doc;
}

export async function updateJob(id: string, data: UpdateJobInput) {
  await dbConnect();
  const doc = await Job.findByIdAndUpdate(id, data, { new: true }).populate(
    "customer"
  );
  if (!doc) {
    const err: AppError = new Error("Job not found");
    err.code = 404;
    throw err;
  }
  return doc;
}

export async function deleteJob(id: string) {
  await dbConnect();
  const doc = await Job.findByIdAndDelete(id);
  if (!doc) {
    const err: AppError = new Error("Job not found");
    err.code = 404;
    throw err;
  }
  return { id };
}
