// actions/logout.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutUser() {
  // Delete the token cookie
  (await cookies()).delete("token");

  // Redirect to the login page
  redirect("/auth/login");
}