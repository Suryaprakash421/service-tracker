import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDbClient } from "@/lib/db"; // your mongodb client
import { nextCookies } from "better-auth/next-js";

export const auth = await (async () => {
  try {
    const client = await getDbClient();
    const db = client.db();
    return betterAuth({
      database: mongodbAdapter(db),
      emailAndPassword: {
        enabled: true,
      },
      plugins: [nextCookies()],
    });
  } catch (e) {
    console.warn(
      "Failed to connect to DB in auth.ts, likely during build. Using mock auth."
    );
    return {
      api: {
        getSession: async () => null,
        signIn: async () => ({ error: "Build mode" }),
        signUp: async () => ({ error: "Build mode" }),
      },
    } as any;
  }
})();
