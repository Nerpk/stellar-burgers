import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const orderNumber = number ? parseInt(number, 10) : null;
  const { allOrders, orders } = useSelector((state) => state.order);
  const { ingredients } = useSelector((state) => state.burger);
  let orderData = orders.find((item) => item.number === orderNumber);

  if (!orderData) {
    orderData = allOrders.orders.find((item) => item.number === orderNumber);
  }

  const orderInfo = useMemo(() => {
    console.log(orders);
    console.log(orderNumber);
    console.log(orderData);
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    //console.log(4);
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
