import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDbClient } from "@/lib/db"; // your mongodb client
import { nextCookies } from "better-auth/next-js";

const client = await getDbClient();
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: { 
        enabled: true, 
    }, 
    plugins: [nextCookies()]
});