import { Navigate } from 'react-router-dom';
import { getAuthPayload, getAuthToken } from '../auth';

function ProtectedRoute({ children, requiredRole = 'any' }) {
  const token = getAuthToken();
  const payload = getAuthPayload();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !payload?.is_admin) {
    return <Navigate to="/shop" replace />;
  }

  if (requiredRole === 'customer' && payload?.is_admin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
