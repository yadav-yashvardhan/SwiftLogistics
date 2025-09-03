import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from 'lucide-react';

const RoleProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    // 1. If the authentication status is still being checked, show a loading screen.
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="h-12 w-12 animate-spin text-purple-600"/>
            </div>
        );
    }

    // 2. If loading is finished and there is no user, redirect to the login page.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If the user's role is in the list of allowed roles, show the requested page.
    if (allowedRoles.includes(user.role)) {
        return <Outlet />;
    } else {
        // 4. If the user's role is not allowed, redirect them to their default page.
        const redirectTo = user.role === 'driver' ? '/driver/dashboard' : '/bookings';
        return <Navigate to={redirectTo} replace />;
    }
};

export default RoleProtectedRoute;