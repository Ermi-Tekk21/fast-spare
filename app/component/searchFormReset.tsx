import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

const SearchFormReset = () => {
    const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement;
        if (form) {
            form.reset();
        }
    }
    
    return (
        <div>
            <Button className="text-slate-500 p-2 hover:text-white hover:bg-slate-600 bg-Sidebar" type="reset" onClick={reset}>
                <Link href="/view-proformas"><X /></Link>
            </Button>
        </div>

    )
}

export default SearchFormReset;