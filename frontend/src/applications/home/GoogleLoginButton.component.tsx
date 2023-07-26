import authService from '@/shared/services/authService';
import { useUserStore } from '@/shared/stores/userStore';
import { GoogleLogin } from '@react-oauth/google';
import JWTManager from '@/shared/lib/jwt';
import { useSocketStore } from '@/shared/stores/socketStore';
import useToaster from '@/shared/hooks/useToaster';
import { ERROR_ICON } from '@/shared/constants';

const GoogleLoginButton = () => {
    const { user, setUser } = useUserStore()
    const {createSocketInstance} = useSocketStore()

    return (
        <GoogleLogin
            size='large'
            locale='en'
            auto_select={false}
            onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) return alert("Login Failed");
                try {
                    const { data } = await authService.loginWithGoogle(credentialResponse.credential)
                    setUser({ ...user, ...data.user })
                    JWTManager.setToken(data.accessToken)
                    createSocketInstance(data.accessToken, data.user.id)
                } catch (error: any) {
                    alert(error.response.data.response)
                }
               
            }}
            onError={() => {
                useToaster({
                    type: "error",
                    message: "Login Failed",
                    bodyClassName: "text-lg font-semibold text-slate-600 text-center",
                    icon: ERROR_ICON,
                    progressStyle: {
                      background: "linear-gradient(90deg, rgba(241,39,17,1) 0%, rgba(245,175,25,1) 100%)",
                    }
                  })
            }}
        />
    )
}

export default GoogleLoginButton
