import { toast } from 'react-toastify';

type UseToasterProps = {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string
    icon?: string
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    bodyClassName?: string,
    progressStyle?: any,
}

const useToaster = (props: UseToasterProps) => {
    const { type, message, icon = "🍣", bodyClassName = "", progressStyle, position = "top-right" } = props
    return toast[type](
        message
        ,
        {
            position,
            icon,
            bodyClassName,
            progressStyle
        })
}

export default useToaster