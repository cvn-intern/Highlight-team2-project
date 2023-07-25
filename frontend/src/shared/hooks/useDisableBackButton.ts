import { useEffect } from 'react'

const useDisableBackButton = () => {
    useEffect(() => {
        window.history.pushState(null, "", window.location.href)
        window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href)
        }
    }, []);
}

export default useDisableBackButton