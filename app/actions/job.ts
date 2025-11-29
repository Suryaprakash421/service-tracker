"use server";

import { createJob, CreateJobInput } from "@/lib/services/jobService";
import { asyncHandler } from "@/lib/utils";

export async function createJobAction(prevState: unknown, formData: FormData) {
  return asyncHandler(async () => {
    const customer = formData.get("customer");
    const deviceModel = formData.get("deviceModel");
    const problem = formData.get("problem");
    const hasSimCard = formData.get("hasSimCard") === "on";
    const hasMemCard = formData.get("hasMemCard") === "on";
    const hasBackCover = formData.get("hasBackCover") === "on";
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
      additionalDetails: additionalDetails,
      status: status,
    } as CreateJobInput;

    const job = await createJob(data);
    return JSON.parse(JSON.stringify(job));
  }, "Job added successfully");
}
