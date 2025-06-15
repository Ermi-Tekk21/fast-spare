"use client"
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Form from 'next/form';
import SearchFormReset from "./searchFormReset";

const SearchForm = ({query}: {query?: string}) => {
    return (
        <Form action="/view-proformas" className="relative search-form flex items-center  justify-center w-2/3">
            <input name="query"  defaultValue={query} placeholder="Search by customer name or plate no" className="pl-8 dark:bg-gray-800 border-2 border-slate-800 rounded-full focus:ring-0 font-light h-12 w-full" />
            <div className="absolute right-5 flex gap-2">
                {query && <SearchFormReset/>}
                <Button type="submit" className="text-slate-500 hover:text-white hover:bg-slate-600 bg-Sidebar">
                    <Search/>
                </Button>
            </div>
        </Form>
    )
}

export default SearchForm;