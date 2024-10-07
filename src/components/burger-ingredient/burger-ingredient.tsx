import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient, setBun } from '../../services/redusers/burgerSlice';
import { useDispatch } from '../../services/store';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const isBun = ingredient.type === 'bun';

    const handleAdd = () => {
      if (!isBun) {
        dispatch(
          addIngredient({ ...ingredient, id: `${ingredient._id} + ${count}` })
        );
      } else {
        dispatch(setBun({ ...ingredient, id: `${ingredient._id} + ${count}` }));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
