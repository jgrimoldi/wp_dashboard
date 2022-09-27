import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';


const ProtectedRoutes = ({ isAllowed, redirectTo, children }) => {

    const location = useLocation();

    if (!isAllowed) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    return children ? children : <Outlet />
}

export default ProtectedRoutes