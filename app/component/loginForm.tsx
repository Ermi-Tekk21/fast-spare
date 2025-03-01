// app/components/loginForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // For toast notifications
import { useTransition } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for client-side redirection
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { User, KeyRound } from "lucide-react";
import { loginUser } from "../auth/actions/login";

const formSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(2)
    .max(50)
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || val.length >= 2,
      { message: "Must be a valid email or at least 2 characters long." }
    ),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long.",
  }),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Initialize useRouter

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        // Create a FormData object and append the form values
        const formData = new FormData();
        formData.append("usernameOrEmail", values.usernameOrEmail);
        formData.append("password", values.password);

        // Call the Server Action
        const result = await loginUser(formData);

        // If login is successful
        if (result?.success) {
          // Show success message
          toast.success("Successfully logged in!", {
            style: {
              backgroundColor: "#00cc00", // Green background
              color: "#ffffff", // White text
              border: "none", // Remove border
            },
          });

          // Redirect to the home page
          router.push("/");
        }
      } catch (error) {
        // Show error message
        toast.error("Invalid username or password!", {
          style: {
            backgroundColor: "#ff4444", // Red background
            color: "#ffffff", // White text
            border: "none", // Remove border
          },
        });
      }
    });
  }

  return (
    <div className="rounded-lg">
      <div className="pb-8">
        <p className="font-semibold dark:text-slate-300 text-2xl text-slate-700 font-sans">
          Welcome back!
        </p>
        <p className="font-extralight dark:text-slate-400 text-slate-600">Please enter your details.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[400px] space-y-5">
          {/* Username or Email */}
          <FormField
            control={form.control}
            name="usernameOrEmail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                    <Input
                      className="custom-input-logout dark:bg-gray-800"
                      placeholder="Enter your username or email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
                    <Input
                      type="password"
                      className="custom-input-logout dark:bg-gray-800"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Link
            className="flex justify-end dark:text-blue-300 text-sm text-blue-800"
            href={`/forgot`}
          >
            Forgot password ?
          </Link>

          {/* Submit Button */}
          <Button
            type="submit"
            className="bg-blue-700 w-full hover:bg-blue-800 font-sans font-semibold transition"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;