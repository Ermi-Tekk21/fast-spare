import CreateProformaForm from "../component/CreateProformaForm";

const Page = () => {
    return(
        <div className="relative flex flex-col items-center">
            <div className="flex flex-col justify-center items-center w-3/4  bg-Sidebar">
            <p className="fixed text-3xl font-semibold bg-Sidebar top-4">Proforma invoice data form</p>
                <CreateProformaForm/>
            </div>
        </div>
    )
}
export default Page;