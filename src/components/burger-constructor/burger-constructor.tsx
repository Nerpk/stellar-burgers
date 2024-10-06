import { FC, useEffect, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearNewOrder, createNewOrder } from '../../services/redusers/orderSlice';
import { removeAllIngredients } from '../../services/redusers/burgerSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const { constructorItems } = useSelector((state) => state.burger);
  const { loading, orderModalData } = useSelector(state => state.order.newOrder)

  const onOrderClick = () => {
    if (constructorItems?.bun && constructorItems?.ingredients.length !== 0) {
      const ingredientIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map(item => item._id),
        constructorItems.bun._id 
      ];
      dispatch(createNewOrder(ingredientIds));
    }
  };
  
  const closeOrderModal = () => {
    dispatch(clearNewOrder());
    dispatch(removeAllIngredients()); 
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={loading}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
