import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function PrivateRoute({ children, adminOnly }) {
    const location = useLocation();
    const token = localStorage.getItem('authToken');

    if (!token) {
        return <Navigate to="/signIn" state={{ from: location }} replace />;
    }

    const decodedToken = jwtDecode(token);
    const isAdmin = decodedToken.role === 'admin';

    if (adminOnly && !isAdmin) {
        return <Navigate to="/forbidden" state={{ from: location }} replace />;
    }

    return children;
}

export default PrivateRoute;
