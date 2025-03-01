// actions/login.ts
"use server";

import { cookies } from "next/headers";

export async function loginUser(formData: FormData) {
  const usernameOrEmail = formData.get("usernameOrEmail") as string;
  const password = formData.get("password") as string;

  // Simulate a successful login
  if (usernameOrEmail === "admin" && password === "admin123") {
    // Create a fake token (for demonstration purposes)
    const fakeToken = "fake-jwt-token";

    // Set the token in a cookie
    (await cookies()).set("token", fakeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Return success status
    return { success: true };
  } else {
    // Throw an error for invalid credentials
    throw new Error("Invalid username or password");
  }
}