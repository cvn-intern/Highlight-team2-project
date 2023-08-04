import authService from '@/shared/services/authService';
import { useUserStore } from '@/shared/stores/userStore';
import { GoogleLogin } from '@react-oauth/google';
import JWTManager from '@/shared/lib/jwt';
import { useSocketStore } from '@/shared/stores/socketStore';
import useToaster from '@/shared/hooks/useToaster';
import { useTranslation } from 'react-i18next';

const GoogleLoginButton = () => {
    const { user, setUser } = useUserStore()
    const { createSocketInstance } = useSocketStore()
    const {socket} = useSocketStore();
    const { t } = useTranslation()
    return (
        <GoogleLogin
            size='large'
            locale='en'
            auto_select={false}
            onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) {
                    useToaster({
                        type: "error",
                        message: t("toastMessage.error.login"),
                    })
                    return;
                };
                try {
                    const { data } = await authService.loginWithGoogle(credentialResponse.credential)
                    setUser({ ...user, ...data.user })
                    JWTManager.setToken(data.accessToken)
                    socket?.disconnect();
                    createSocketInstance(data.accessToken, data.user.id)
                } catch (error: any) {
                    useToaster({
                        type: "error",
                        message: error.response.data.response || t("toastMessage.error.somethingWentWrong"),
                    })
                }

            }}
            onError={() => {
                useToaster({
                    type: "error",
                    message: t("toastMessage.error.login"),
                })
            }}
        />
    )
}

export default GoogleLoginButton
