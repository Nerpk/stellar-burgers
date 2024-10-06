import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/redusers/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  const {orders} = useSelector(state => state.order)

  return <ProfileOrdersUI orders={orders} />;
};
