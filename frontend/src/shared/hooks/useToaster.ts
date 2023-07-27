import { toast } from 'react-toastify';
import { ERROR_ICON, ERROR_PROGRESS_BAR_STYLE, SUCCESS_ICON, SUCCESS_PROGRESS_BAR_STYLE, WARNING_ICON, WARNING_PROGRESS_BAR_STYLE } from '../constants';

type UseToasterProps = {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string
    icon?: string
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    bodyClassName?: string,
    progressStyle?: any,
}

const useToaster = (props: UseToasterProps) => {
    const {
        type,
        message,
        bodyClassName = 'text-lg font-semibold text-slate-600 text-center',
        icon = type === 'error' ? ERROR_ICON : type === 'warning' ? WARNING_ICON : SUCCESS_ICON,
        progressStyle = type === 'error'
            ? { background: ERROR_PROGRESS_BAR_STYLE }
            : type === 'warning'
                ? { background: WARNING_PROGRESS_BAR_STYLE }
                : { background: SUCCESS_PROGRESS_BAR_STYLE },
        position = "top-right",
    } = props;

    return toast[type](
        message,
        {
            position,
            icon,
            bodyClassName,
            progressStyle,
        }
    );
};

export default useToaster;