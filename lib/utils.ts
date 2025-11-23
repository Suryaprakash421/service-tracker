import { clsx, type ClassValue } from "clsx";
import { error } from "console";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showLoadingToast(
  promise: Promise<any>,
  redirectTo: () => void
) {
  toast.promise(promise, {
    loading: "Loading...",
    success: (data) => {
      redirectTo();
      return data.message || "Success";
    },
    error: (error) => error.message || "An error occurred",
  });
}

export type ActionResponse<T = any> = {
  status: "ok" | "created" | "not-found" | "error" | "unauthorized" | string;
  code: number;
  message: string;
  success: boolean;
  result?: T;
};

// 2. Create the AsyncHandler wrapper
export async function asyncHandler<T>(
  fn: () => Promise<T>,
  successMessage: string = "Success",
  successCode: number = 200,
  successStatus: string = "ok"
): Promise<ActionResponse<T>> {
  try {
    const result = await fn();
    return {
      status: successStatus,
      code: successCode,
      message: successMessage,
      success: true,
      result,
    };
  } catch (error: any) {
    // Important: Re-throw Next.js redirects so navigation works
    if (
      error.message === "NEXT_REDIRECT" ||
      error.digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      status: "error",
      code: error.status || 500,
      message: error.message || "An unexpected error occurred",
      success: false,
    };
  }
}
