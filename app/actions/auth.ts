"use server";

import { auth } from "@/lib/auth";
import { asyncHandler } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInAction(prevState: unknown, formData: FormData) {
  return asyncHandler(async () => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Assuming auth.api.signInEmail returns the session or user object
    const response = await auth.api.signInEmail({ body: { email, password } });
    return response;
  }, "Signed in successfully");
}

export async function signUpAction(prevState: unknown, formData: FormData) {
  return asyncHandler(
    async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const name = formData.get("name") as string;

      const response = await auth.api.signUpEmail({
        body: { email, password, name },
      });
      return response;
    },
    "Signed up successfully",
    201,
    "created"
  );
}

export async function signOutAction() {
  return asyncHandler(async () => {
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect("/");
  });
}
