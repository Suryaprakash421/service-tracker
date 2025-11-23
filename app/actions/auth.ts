"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const session = await auth.api.signInEmail({ body: { email, password } });
    return { success: true, message: "Signed in successfully" };
  } catch (error: any) {
    // Return error message for display
    return { error: error.message || "Invalid credentials" };
  }
}

// Similarly for signUpAction (adjust as needed)
export async function signUpAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  try {
    const user = await auth.api.signUpEmail({
      body: { email, password, name },
    });
    return { success: true, message: "Signed up successfully" };
  } catch (error: any) {
    return { error: error.message || "Sign-up failed" };
  }
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  return redirect("/");
}
