import { ModeToggle } from "@/components/ModeToggle";
import Login from "../../component/Login";

const Auth = () => {
    return (
        <div>
            <div className="flex justify-end mr-10 absolue">
                <ModeToggle />
            </div>
            <Login />
        </div>
    )
}
export default Auth;