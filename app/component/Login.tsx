import Image from "next/image"
import Logo from "@/public/LogoLogin.png"
import Hero from "@/public/Hero.png"
import LoginForm from "./loginForm"
import { Copyright } from "lucide-react"

const Login = () => {
    return (
        <main className="flex flex-col justify-center items-center align-middle min-h-screen w-full relative">
            <div className="lg:w-1044 h-130 flex items-center gap-10 justify-around bg-headerBg rounded-md shadow-sm absolute px-10 top-50">
                <Image src={Logo} alt="logo"></Image>
                <div className="text-headerTxt font-sans font-semibold text-[30px] text-center">
                    <p>Effortless Proforma Invoice Management for Car Spare Parts Shops</p>
                </div>
            </div>

            <div className="flex justify-around px-11 items-center lg:w-login-w pt-14 h-login-h bg-lgspace rounded-md shadow-sm">
                <div className="flex items-center pt-8 flex-col gap-3">
                    <Image src={Hero} alt="logo"></Image>
                    <p className="font-sans text-sm font-extralight text-slate-600 flex gap-3"><Copyright height={20} width={20}/>All Right Reserved</p>
                </div>
                <LoginForm />
            </div>
        </main>


    )
}

export default Login