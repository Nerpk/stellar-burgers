import { FC, ReactElement } from "react";
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from "../services/store";

// Route для страниц, доступных только авторизованным пользователям
export const ProtectedRoute: FC<{ children: ReactElement }> = ({ children }) => {
  const { isAuth } = useSelector((state) => state.user);

  return isAuth ? children :  <Navigate to='/login' replace />;

};

// Route для страниц, доступных только НЕавторизованным пользователям 
export const UnprotectedRoute: FC<{ children: ReactElement }> = ({ children }) => {
  const { isAuth } = useSelector((state) => state.user);

  return isAuth ? <Navigate to='/' replace /> : children;
};
