import { Button } from "@/components/ui/button";
import { Edit, User } from "lucide-react";

const Page = () => {
    return (
        <div className="flex flex-col gap-20 items-center">
            <div className="w-3/4 bg-Sidebar rounded-md shadow-md h-52">
                <div className="flex w-full justify-end p-4">
                    <Button className="bg-slate-600 hover:bg-slate-700">Edit <Edit /></Button>
                </div>
                <div className="w-full h-10">
                </div>
                <div className="w-full flex justify-around items-end">
                    <p className="w-1/3 rounded-sm bottom-1 border-slate-800 bg-white pl-4 py-2">User name: Admin</p>
                    <div className="w-40 h-40 rounded-full bg-white flex justify-center items-center"><User className="h-20 text-slate-600 w-20" /></div>
                    <p className="w-1/3 rounded-sm bottom-1 border-slate-800 bg-white pl-4 py-2">email: admin***@gmail.com</p>
                </div>
            </div>
            <p className="w-1/3 rounded-sm bottom-1 border-slate-800 bg-white pl-4 py-2">password: admin********</p>
        </div>
    )
}
export default Page;