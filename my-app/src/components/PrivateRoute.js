import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
    const location = useLocation();
    const token = localStorage.getItem('authToken'); 

    if (!token) {
        return <Navigate to="/signIn" state={{ from: location }} replace />;
    }

    return children;
}

export default PrivateRoute;
