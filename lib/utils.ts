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
