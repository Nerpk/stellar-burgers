import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';

// Route для страниц, доступных только авторизованным пользователям
export const ProtectedRoute: FC<{ children: ReactElement }> = ({
  children
}) => {
  const location = useLocation();
  const { isAuth } = useSelector((state) => state.user);

  return isAuth ? (
    children
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

// Route для страниц, доступных только НЕавторизованным пользователям
export const UnprotectedRoute: FC<{ children: ReactElement }> = ({
  children
}) => {
  const location = useLocation();
  const { isAuth } = useSelector((state) => state.user);

  return isAuth ? (
    <Navigate to='/' state={{ from: location }} replace />
  ) : (
    children
  );
};
