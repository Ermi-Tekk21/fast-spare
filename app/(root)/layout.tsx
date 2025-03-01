import Navbar from "../component/navbar";
import Sidebar from "../component/sidebar";

// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="fixed flex justify-between w-full">
          <Sidebar />
          <Navbar />
        </div>
        <div className="pl-[275px] pt-16 text-balance">{children}</div>
    </div>
  );
}

