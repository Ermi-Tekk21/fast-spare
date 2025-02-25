"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Google from "@/public/devicon_google.svg"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { User, KeyRound } from "lucide-react"
import Image from "next/image"

const formSchema = z.object({
    usernameOrEmail: z.string().min(2).max(50).refine((val) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || val.length >= 2;
    }, { message: "Must be a valid email or at least 2 characters long." }),

    password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

const LoginForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            usernameOrEmail: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form Data:", values);
    }

    return (
        <div className="rounded-lg">
            <div className="pb-8">
                <p className="font-semibold text-2xl text-slate-700 font-sans">Welcome back!</p>
                <p className="font-extralight text-slate-600">Please enter your details.</p>
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
                                            className="pl-10 bg-root"
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
                                            className="pl-10 bg-root"
                                            placeholder="Enter your password"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        )}
                    />
                    <Link className="flex justify-end text-sm text-blue-800" href={`/forgot`}>Forgot password ?</Link>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="bg-blue-700 w-full hover:bg-blue-800 font-sans font-semibold transition"
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>
            <Button className="w-full mt-4 bg-root hover:bg-slate-200 text-slate-700 font-sans font-semibold">
            <Image src={Google} alt="Google Logo" width={28} height={28} />
            Continue with Google</Button>
        </div>
    );
};

export default LoginForm;
