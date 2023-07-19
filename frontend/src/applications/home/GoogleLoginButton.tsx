import authService from '@/shared/services/authService';
import { useUserStore } from '@/shared/stores/userStore';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = () => {
    const { user, setUser } = useUserStore()
    return (
        <GoogleLogin
            size='large'
            locale='en'
            auto_select={false}
            onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) return alert("Login Failed");
                const { data } = await authService.loginWithGoogle(credentialResponse.credential)
                setUser({ ...user, ...data })
            }}
            onError={() => {
                alert("Login Failed");
            }}
        />
    )
}

export default GoogleLoginButton