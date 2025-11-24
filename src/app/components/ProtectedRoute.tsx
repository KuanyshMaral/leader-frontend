import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@features/auth';
import { Spinner } from '@shared/components/ui';
import { UserRole } from '@shared/types/enums';

interface ProtectedRouteProps {
    children: ReactNode;
    roles?: UserRole[];
}

/**
 * Protected route wrapper - requires authentication
 */
export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
    const { user, isLoading, isAuthenticated } = useAuth();

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role-based access
    if (roles && user && !roles.includes(user.role)) {
        // Redirect based on user role
        if (user.role === UserRole.ADMIN) {
            return <Navigate to="/admin/users" replace />;
        }
        if (user.role === UserRole.PARTNER) {
            return <Navigate to="/partner/applications" replace />;
        }
        return <Navigate to="/applications" replace />;
    }

    return <>{children}</>;
};
