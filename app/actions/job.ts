"use server";

import {
  createJob,
  CreateJobInput,
  listJobs,
  updateJobStatus,
} from "@/lib/services/jobService";
import { asyncHandler } from "@/lib/utils";

export async function createJobAction(prevState: unknown, formData: FormData) {
  return asyncHandler(async () => {
    const customer = formData.get("customer");
    const deviceModel = formData.get("deviceModel");
    const problem = formData.get("problem");
    const hasSimCard = formData.get("hasSimCard") === "on";
    const hasMemCard = formData.get("hasMemCard") === "on";
    const hasBackCover = formData.get("hasBackCover") === "on";
    const estimatedPrice = formData.get("estimatedPrice");
    const paidAmount = formData.get("paidAmount");
    const additionalDetails = formData.get("additionalDetails");
    const status = formData.get("status");

    const data = {
      customer: customer,
      deviceModel: deviceModel,
      problem: problem,
      inventory: {
        hasSimCard: hasSimCard,
        hasMemCard: hasMemCard,
        hasBackCover: hasBackCover,
      },
      estimatedPrice: Number(estimatedPrice),
      paidAmount: Number(paidAmount),
      additionalDetails: additionalDetails,
      status: status,
    } as CreateJobInput;

    const job = await createJob(data);
    return JSON.parse(JSON.stringify(job));
  }, "Job added successfully");
}

export async function getJobAction(
  page: number = 1,
  limit: number = 20,
  status?: string
) {
  return asyncHandler(async () => {
    const jobs = await listJobs(page, limit, status);
    return JSON.parse(JSON.stringify(jobs));
  }, "Jobs fetched successfully");
}

export async function updateJobStatusAction(id: string, status: string) {
  return asyncHandler(async () => {
    const job = await updateJobStatus(id, status);
    return JSON.parse(JSON.stringify(job));
  }, "Job status updated successfully");
}
