import { Navigate } from 'react-router-dom';
import { isAdminUser } from '../auth';

function RoleHome() {
  return <Navigate to={isAdminUser() ? '/admin' : '/shop'} replace />;
}

export default RoleHome;
