import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { urls } from '../../routers/urls';
import { useAuthValidator } from '../../store';
export function LoadingCallBack() {
    const { isAuthenticate } = useAuthValidator((state: { isAuthenticate: boolean }) => state);    
    const navigate = useNavigate()
    useEffect(() => {
        if (isAuthenticate) {
            navigate(urls.BASE_URL)
        } else {
            navigate(urls.LOGIN)
        }
    }, [])
    return null
}
