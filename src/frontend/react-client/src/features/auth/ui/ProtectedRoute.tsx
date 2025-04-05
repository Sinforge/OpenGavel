import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Navigate, useLocation } from 'react-router-dom';
import {JSX} from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};