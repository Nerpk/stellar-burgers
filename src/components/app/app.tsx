import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { ProtectedRoute, UnprotectedRoute } from '../../utils/ProtectedRoute';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect, useState } from 'react';
import { fetchIngredients } from '../../services/redusers/burgerSlice';
import { fetchFeeds, fetchOrders } from '../../services/redusers/orderSlice';
import { restoreUser } from '../../services/redusers/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
    dispatch(restoreUser());
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/stellar-burgers/' element={<ConstructorPage />} />
        <Route path='/stellar-burgers/feed' element={<Feed />} />

        <Route
          path='/stellar-burgers/login'
          element={
            <UnprotectedRoute>
              <Login />
            </UnprotectedRoute>
          }
        />
        <Route
          path='/stellar-burgers/register'
          element={
            <UnprotectedRoute>
              <Register />
            </UnprotectedRoute>
          }
        />
        <Route
          path='/stellar-burgers/forgot-password'
          element={
            <UnprotectedRoute>
              <ForgotPassword />
            </UnprotectedRoute>
          }
        />
        <Route
          path='/stellar-burgers/reset-password'
          element={
            <UnprotectedRoute>
              <ResetPassword />
            </UnprotectedRoute>
          }
        />

        <Route
          path='/stellar-burgers/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/stellar-burgers/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path='/stellar-burgers/feed/:number' element={<OrderInfo />} />
        <Route
          path='/stellar-burgers/ingredients/:id'
          element={<IngredientDetails />}
        />
        <Route
          path='/stellar-burgers/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/stellar-burgers/feed/:number'
            element={
              <Modal title='Order Info' onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/stellar-burgers/ingredients/:id'
            element={
              <Modal title='Ingredient Info' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/stellar-burgers/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Order Info' onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
