import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuid4 } from 'uuid';

export const fetchIngredients = createAsyncThunk(
  'burger/fetchIngredients',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

export type TBurgerState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

export const initialState: TBurgerState = {
  ingredients: [],
  loading: false,
  error: null,
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    // Установка булочки
    setBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    // Добавление ингредиента в конструктор
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    // Передвижение ингредиента вверх по списку
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        [
          state.constructorItems.ingredients[index - 1],
          state.constructorItems.ingredients[index]
        ] = [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index - 1]
        ];
      }
    },
    // Передвижение ингредиента вниз по списку
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.constructorItems.ingredients.length - 1) {
        [
          state.constructorItems.ingredients[index + 1],
          state.constructorItems.ingredients[index]
        ] = [
          state.constructorItems.ingredients[index],
          state.constructorItems.ingredients[index + 1]
        ];
      }
    },
    // Удаление ингредиента из конструктора
    removeIngredient: (state, action: PayloadAction<number>) => {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    removeAllIngredients: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  }
});

export const {
  setBun,
  addIngredient,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  removeAllIngredients
} = burgerSlice.actions;

export { initialState as burgerInitialState };

export default burgerSlice.reducer;
