import Cookies from "js-cookie";
import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { authActions, selectCurrentUser } from "../../app/features/authentication/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface ProjectedRouteProps {
    children: ReactElement,
}

const ProtectedRoute = ({
    children,
}: ProjectedRouteProps) => {
    const dispatch = useAppDispatch();
    let userAuth = Cookies.get('auth');
    const currentUser = useAppSelector(selectCurrentUser);

    
    if (!userAuth) {
        if (currentUser) {
            dispatch(authActions.logout());
        }
        return <Navigate to={'/login'} />;
    }
    return children;
};

export default ProtectedRoute;