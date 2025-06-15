"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"


const formSchema = z.object({
    customerName: z.string().min(2, "Customer name must be at least 2 characters").max(50, "Customer name must not exceed 50 characters"),
    plateNumber: z.string().min(2, "Plate number must be at least 2 characters").max(7, "Plate number must not exceed 7 characters"),
    description: z.string().min(2, "Description must be at least 2 characters").max(200, "Description must not exceed 200 characters"), // Increased max length
    costPrice: z.number().min(1, "Cost price must be a positive number"),  // Changed to number
    sellingPrice: z.number().min(1, "Selling price must be a positive number"), // Changed to number
    quantity: z.number().min(1, "Quantity must be at least 1"), // Changed to number
});




const CreateProformaForm = () => {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full p-32 space-y-8">
                <div className="flex w-full justify-between">
                <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="custom-input focus:border-white-50 focus:ring-none" placeholder="Customer name" {...field} /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="plateNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="custom-input focus:border-white-50 focus:ring-none" placeholder="Plate number" {...field} /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                </div>
                <hr className="border-t-4" />
                <div className="flex flex-col gap-3">
                    <p className="text-slate-700">Item 1</p>
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="custom-input focus:border-white-50 focus:ring-none" placeholder="Description" {...field} /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="custom-input focus:border-white-50 focus:ring-none" placeholder="Cost price" {...field} /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="custom-input focus:border-white-50 focus:ring-none" placeholder="Selling price" {...field} /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="custom-input focus:border-white-50 focus:ring-none" placeholder="Quantity" {...field} /> 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                <p className="custom-input w-60 text-slate-600">Total amount: </p>
                </div>
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default CreateProformaForm;