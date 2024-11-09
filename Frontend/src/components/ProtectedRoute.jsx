import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (roles.length && !roles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  if (typeof children === 'function') {
    return children({ user });
  }

  return children;
};

export default ProtectedRoute; 