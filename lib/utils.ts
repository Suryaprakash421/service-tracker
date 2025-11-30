import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showLoadingToast<T extends { message?: string }>(
  promise: Promise<T>,
  redirectTo: () => void
) {
  toast.promise(promise, {
    loading: "Loading...",
    success: (data: T) => {
      redirectTo();
      return data.message || "Success";
    },
    error: (err: unknown) =>
      (err as { message?: string })?.message || "An error occurred",
  });
}

export type ActionResponse<T = any> = {
  status: "ok" | "created" | "not-found" | "error" | "unauthorized" | string;
  code: number;
  message: string;
  result?: T; // present only on success
};

// 2. Create the AsyncHandler wrapper
interface AppError extends Error {
  code?: number;
  status?: number;
  digest?: string;
}

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
      result,
    };
  } catch (err: unknown) {
    const error = err as AppError;
    if (
      error?.message === "NEXT_REDIRECT" ||
      error?.digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    if (error?.name === "CastError") {
      return {
        status: "not-found",
        code: 404,
        message: "Resource not found",
      };
    }
    const code = error?.code || error?.status || 500;
    return {
      status: code === 404 ? "not-found" : "error",
      code,
      message: error?.message || "Internal Server Error",
    };
  }
}

export function hideAadharNumber(aadharNumber: string): string {
  if (aadharNumber.length >= 12) {
    return "XXXX-XXXX-" + aadharNumber.slice(8);
  }
  return aadharNumber;
}
