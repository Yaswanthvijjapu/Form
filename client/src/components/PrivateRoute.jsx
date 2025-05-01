import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const PrivateRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;