import authService from '@/shared/services/authService';
import { useUserStore } from '@/shared/stores/userStore';
import { GoogleLogin } from '@react-oauth/google';
import JWTManager from '@/shared/lib/jwt';
import { useSocketStore } from '@/shared/stores/socketStore';

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
                    JWTManager.setToken(data.accessToken);
                    createSocketInstance(data.accessToken)
                } catch (error: any) {
                    alert(error.response.data.response)
                }
               
            }}
            onError={() => {
                alert("Login Failed");
            }}
        />
    )
}

export default GoogleLoginButton
