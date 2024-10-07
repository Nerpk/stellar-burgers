import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/redusers/orderSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const { allOrders } = useSelector((state) => state.order);
  const orders: TOrder[] = allOrders.orders;

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
