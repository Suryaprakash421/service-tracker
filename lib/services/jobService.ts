import dbConnect from "@/lib/db";
import Job from "@/lib/model/Job.model";
import Customer from "@/lib/model/Customer.model";
import { PipelineStage } from "mongoose";

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
  estimatedPrice?: number;
  paidAmount?: number;
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
  estimatedPrice?: number;
  paidAmount?: number;
  additionalDetails?: string;
  status?: string;
}

export async function createJob(data: CreateJobInput) {
  await dbConnect();
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
  search?: string,
  status?: string
) {
  await dbConnect();
  const query: Record<string, unknown> = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { deviceModel: { $regex: search, $options: "i" } },
      { problem: { $regex: search, $options: "i" } },
      { additionalDetails: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.phoneNumber": { $regex: search, $options: "i" } },
    ];
  }
  const skip = (page - 1) * limit;

  const itemPipeline: PipelineStage[] = [
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: "$customer" },
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const totalPipeline: PipelineStage[] = [
    {
      $lookup: {
        from: "customers",
        localField: "customer",
        foreignField: "_id",
        as: "customer",
      },
    },
    { $unwind: "$customer" },
    { $match: query },
    { $count: "total" },
  ];

  const [itemsResult, totalResult] = await Promise.all([
    Job.aggregate(itemPipeline),
    Job.aggregate(totalPipeline),
  ]);

  const total = totalResult[0] ? totalResult[0].total : 0;

  return { items: itemsResult, total, page, pages: Math.ceil(total / limit) };
}

export async function getJob(id: string) {
  await dbConnect();
  const doc = await Job.findById(id).populate("customer").lean();
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

export async function updateJobStatus(id: string, status: string) {
  await dbConnect();
  const doc = await Job.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate("customer");
  if (!doc) {
    const err: AppError = new Error("Job not found");
    err.code = 404;
    throw err;
  }
  return doc;
}
