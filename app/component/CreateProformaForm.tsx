"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ArrowDownLeftFromSquare, Delete, PlusCircle, Save } from "lucide-react"

// Form schema definition
const formSchema = z.object({
    customerName: z.string().min(2, "Customer name must be at least 2 characters").max(50, "Customer name must not exceed 50 characters"),
    plateNumber: z.string().min(2, "Plate number must be at least 2 characters").max(7, "Plate number must not exceed 7 characters"),
    items: z.array(z.object({
        description: z.string().min(2, "Description must be at least 2 characters").max(200, "Description must not exceed 200 characters"),
        costPrice: z.number().min(1, "Cost price must be a positive number"),
        sellingPrice: z.number().min(1, "Selling price must be a positive number"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
    })).nonempty("At least one item is required"),
})

const CreateProformaForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            plateNumber: "",
            items: [{ description: "", costPrice: 0, sellingPrice: 0, quantity: 1 }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items", // This is the name of the array field in the schema
    })

    // Handle form submission
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values) // You can handle the submission logic here
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
                                <FormLabel htmlFor="customerName">Customer Name</FormLabel>
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
                                <FormLabel htmlFor="plateNumber">Plate Number</FormLabel>
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
                    <p className="text-slate-700 text-center">Items</p>

                    {/* Dynamically rendered items */}
                    {fields.map((item, index) => (
                        <div key={item.id} className="flex flex-col gap-3">
                            <FormField
                                control={form.control}
                                name={`items.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor={`items.${index}.description`}>Description</FormLabel>
                                        <FormControl>
                                            <Input className="custom-input focus:border-white-50 focus:ring-none" placeholder="Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`items.${index}.costPrice`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor={`items.${index}.costPrice`}>Cost Price</FormLabel>
                                        <FormControl>
                                            <Input className="custom-input focus:border-white-50 focus:ring-none" placeholder="Cost price" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`items.${index}.sellingPrice`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor={`items.${index}.sellingPrice`}>Selling Price</FormLabel>
                                        <FormControl>
                                            <Input className="custom-input focus:border-white-50 focus:ring-none" placeholder="Selling price" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor={`items.${index}.quantity`}>Quantity</FormLabel>
                                        <FormControl>
                                            <Input className="custom-input focus:border-white-50 focus:ring-none" placeholder="Quantity" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-3 justify-end">
                                <div className="flex items-center justify-between">
                                    <p className="custom-input w-60 text-slate-600">Total amount: {/* Add your calculation logic here */}</p>
                                </div>
                                {/* Remove button for each item */}
                                <Button className="w-min" variant="outline" onClick={() => remove(index)}>Remove Item <Delete /></Button>
                            </div>
                        </div>
                    ))}


                </div>

                <hr className="border-t-4" />

                <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" className="w-min" onClick={() => append({ description: "", costPrice: 0, sellingPrice: 0, quantity: 1 })}>
                        Add Item <PlusCircle className="text-black" />
                    </Button>
                    <Button type="submit">
                        Save <Save />
                    </Button>
                    <Button>
                        Download <ArrowDownLeftFromSquare />
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateProformaForm
