import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { loginUser, setAuth } from '../../services/redusers/userSlice';

export const Login: FC = () => {
  const { user } = useSelector((state) => state.user);

  const [email, setEmail] = useState(user?.email as string);
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .catch((err) => {
        console.error('Ошибка входа:', err);
      })
      .finally(() => {
        setAuth(true);
        navigate('/');
      });
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
