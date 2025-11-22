"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUpActionn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  // Call your sign-up logic here, e.g., using better-auth
  const user = await auth.api.signUpEmail({ body: { email, password, name } });

  return redirect("/");
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Call your sign-in logic here, e.g., using better-auth
  const session = await auth.api.signInEmail({ body: { email, password } });

  return redirect("/");
}

export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  return redirect("/");
}
