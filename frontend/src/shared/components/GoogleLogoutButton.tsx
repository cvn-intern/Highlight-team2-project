import { LogOut } from "lucide-react";
import { Button } from "./shadcn-ui/Button";
import authService from "../services/authService";
import useToaster from "@/shared/hooks/useToaster";
import { useUserStore } from "../stores/userStore";
import { useTranslation } from "react-i18next";

const GoogleLogoutButton = () => {
    const {user, deleteUser} = useUserStore();
    const { t } = useTranslation()
    const handleLogout = async () => {
        try {
            await authService.logout();
            deleteUser()
            window.location.reload()
        } catch (error) {
            useToaster({
                type: "error",
                message: t("toastMessage.error.logout"),
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
                    <span>{t("logoutButton")}</span>
                </Button>
            )}
        </>

    )
}

export default GoogleLogoutButton;