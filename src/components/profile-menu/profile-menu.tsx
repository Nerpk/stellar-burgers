import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logoutUser, outUser } from '../../services/redusers/userSlice'; // экшен для выхода пользователя
import { ProfileMenuUI } from '@ui';
import { clearTokens } from '../../utils/tokens';
import { removeAllIngredients } from '../../services/redusers/burgerSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    clearTokens();
    localStorage.removeItem('user');
    dispatch(logoutUser());
    dispatch(outUser());
    dispatch(removeAllIngredients());
    navigate('/stellar-burgers/login');
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
