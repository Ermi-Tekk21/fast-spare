"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Delete, PlusCircle, Save } from "lucide-react"
import { toast } from "sonner" // For toast notifications
import { ScrollArea } from "@/components/ui/scroll-area"

// Form schema definition
const formSchema = z.object({
    customerName: z.string().min(2, "Customer name must be at least 2 characters").max(50, "Customer name must not exceed 50 characters"),
    plateNumber: z.string().min(2, "Plate number must be at least 2 characters").max(20, "Plate number must not exceed 20 characters"),
    proformaNumber: z.string().min(2, "Plate number must be at least 2 characters").max(20, "Plate number must not exceed 20 characters"),
    vin: z.string().min(2, "VIN must be at least 2 characters").max(17, "VIN must not exceed 17 characters"),
    model: z.string().min(2, "Model must be at least 2 characters").max(50, "Model must not exceed 50 characters"),
    referenceNumber: z.string().min(2, "Reference number must be at least 2 characters").max(50, "Reference number must not exceed 50 characters"),
    deliveryTime: z.string().min(1, "Delivery time is required"),
    preparedBy: z.string().min(2, "Prepared by must be at least 2 characters").max(50, "Prepared by must not exceed 50 characters"),
    items: z.array(z.object({
        itemName: z.string().min(2, "Item name must be at least 2 characters").max(200, "Item name must not exceed 200 characters"),
        unit: z.string().min(1, "Unit is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unitPrice: z.number().min(1, "Unit price must be a positive number"),
    })).nonempty("At least one item is required"),
})

const CreateProformaForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            plateNumber: "",
            proformaNumber: "",
            vin: "",
            model: "",
            referenceNumber: "",
            deliveryTime: "",
            preparedBy: "",
            items: [{ itemName: "", unit: "pcs", quantity: 1, unitPrice: 0 }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items", // This is the name of the array field in the schema
    })

    // Calculate total price of all items
    const items = form.watch("items") // Watch the items array for changes
    const totalPrice = items.reduce((sum, item) => {
        return sum + item.unitPrice * item.quantity
    }, 0)

    // Handle form submission
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Add the current date to the submitted data
        const formData = {
            ...values,
            createdAt: new Date().toISOString(), // Add current date in ISO format
        };

        console.log(formData); // Log the form data with the createdAt field
        toast.success("Proforma saved successfully!",
            {
                style: {
                    backgroundColor: "#00cc00", // Green background
                    color: "#ffffff", // White text
                    border: "none", // Remove border
                },
            }
        ); // Show success message
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full relative px-32 py-4 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="customerName">Customer Name</FormLabel>
                                <FormControl>
                                    <Input className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none" placeholder="Customer name eg:Zemen Insurance" {...field} />
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
                                    <Input className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none" placeholder="Plate number eg:03-823528AA" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="proformaNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="plateNumber">Proforma Number</FormLabel>
                                <FormControl>
                                    <Input className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none" placeholder="Eg: PRF-2025/02/79-005" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="vin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="vin">VIN</FormLabel>
                                <FormControl>
                                    <Input className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none" placeholder="VIN eg:LGXEXL4CRO227320" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="model">Model</FormLabel>
                                <FormControl>
                                    <Input className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none" placeholder="Model eg:BYD Seagull" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="referenceNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="referenceNumber">Reference Number</FormLabel>
                                <FormControl>
                                    <Input className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none" placeholder="Reference number eg:V0012" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="deliveryTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="deliveryTime">Delivery Time (in days)</FormLabel>
                                <FormControl>
                                    <Input className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none" placeholder="Delivery time eg:3" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="preparedBy"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="preparedBy">Prepared By</FormLabel>
                                <FormControl>
                                    <Input className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none" placeholder="Prepared by eg:Ermias" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Items Section */}
                <div className="text-slate-700 dark:text-slate-100 text-center">
                    <p>Items</p>
                    <hr className="border-t-4 dark:border-slate-900" />
                </div>

                <ScrollArea className="h-[400px] p-4">
                    <div className="flex flex-col gap-2">
                        {/* Dynamically rendered items */}
                        {fields.map((item, index) => {
                            const unitPrice = form.watch(`items.${index}.unitPrice`)
                            const quantity = form.watch(`items.${index}.quantity`)
                            const totalAmount = unitPrice * quantity

                            return (
                                <div key={item.id} className="flex flex-col gap-2 px-4">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.itemName`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor={`items.${index}.itemName`}>Item Name</FormLabel>
                                                <FormControl>
                                                    <Input className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none" placeholder="Item name eg:Thunder DDP Glass Down" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.unit`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor={`items.${index}.unit`}>Unit</FormLabel>
                                                <FormControl>
                                                    <Input className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none" placeholder="Unit eg:pcs" {...field} />
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
                                                    <Input
                                                        type="number"
                                                        className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none"
                                                        placeholder="Quantity"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            field.onChange(isNaN(value) ? 0 : value); // Handle NaN
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.unitPrice`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor={`items.${index}.unitPrice`}>Unit Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        className="custom-input dark:bg-gray-900 focus:border-white-50 focus:ring-none"
                                                        placeholder="Unit price"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            field.onChange(isNaN(value) ? 0 : value); // Handle NaN
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-3 items-center justify-end">
                                        <div className="flex items-center justify-between">
                                            <p className="custom-input text-sm w-60 dark:bg-gray-900 dark:text-slate-100 text-slate-600">Total price: {totalAmount.toFixed(2)}</p>
                                        </div>
                                        {/* Remove button for each item */}
                                        <Button className="w-min" variant="outline" onClick={() => remove(index)}>Remove Item <Delete /></Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>

                <hr className="border-t-4 dark:border-slate-900" />

                {/* Total Price and Buttons */}
                <div className="flex gap-2 items-center justify-end">
                    <div className="flex items-center justify-between">
                        <p className="custom-input w-80 text-slate-60 dark:bg-gray-900 dark:text-slate-100 text-sm">Total Price of all items: {totalPrice.toFixed(2)}</p>
                    </div>
                    <Button type="button" variant="outline" className="w-min" onClick={() => append({ itemName: "", unit: "pcs", quantity: 1, unitPrice: 0 })}>
                        Add Item <PlusCircle className="text-black" />
                    </Button>
                    <Button type="submit">
                        Save <Save />
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CreateProformaForm