import { LogOut } from "lucide-react";
import { Button } from "./shadcn-ui/Button";
import authService from "../services/authService";
import useToaster from "@/shared/hooks/useToaster";
import { useUserStore } from "../stores/userStore";

const GoogleLogoutButton = () => {
    const {user, deleteUser} = useUserStore();
    const handleLogout = async () => {
        try {
            await authService.logout();
            deleteUser()
            window.location.reload()
        } catch (error) {
            useToaster({
                type: "error",
                message: "Log out failed!",
            })
        }
    };

    return (
        <>
            {!user?.is_guest && (
                <Button
                    className="flex items-center gap-2 mx-auto mt-4 bg-blue-700 h-9 hover:bg-red-400"
                    style={{ borderRadius: "5px" }}
                    onClick={handleLogout}
                >
                    <LogOut />
                    <span>LOG OUT</span>
                </Button>
            )}
        </>

    )
}

export default GoogleLogoutButton;