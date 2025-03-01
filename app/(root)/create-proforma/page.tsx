import CreateProformaForm from "../../component/CreateProformaForm";

const Page = () => {
  return (
    <div className="flex justify-center pb-24">
      <div className="flex w-5/6 flex-col bg-Sidebar dark:bg-gray-800 rounded-lg items-center p-6">
        {/* Styled Note */}
        <div className="w-full bg-yellow-100 dark:bg-indigo-800 dark:text-slate-300 text-yellow-800 p-4 rounded-lg mb-6 border border-yellow-200 dark:border-yellow-300">
          <p className="text-sm font-medium">
            <span className="font-bold">Note!</span> Proforma numbers need to be unique. The format is{" "}
            <code className="bg-yellow-200 dark:bg-indigo-600 px-1.5 py-0.5 rounded">PRF-date-00*</code>{" "}
            (e.g., <code className="bg-yellow-200 dark:bg-indigo-600 px-1.5 py-0.5 rounded">PRF-2025/05/02-004</code>), where{" "}
            <code className="bg-yellow-200 dark:bg-indigo-600 px-1.5 py-0.5 rounded">004</code> represents the fourth proforma on this day.
          </p>
        </div>

        {/* Form Component */}
        <CreateProformaForm />
      </div>
    </div>
  );
};

export default Page;