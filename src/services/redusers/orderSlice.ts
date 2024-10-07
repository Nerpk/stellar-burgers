import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TAllOrders = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type TOrderState = {
  orders: TOrder[]; // Все заказы пользователя
  orderDetails: TOrder | null; // Данные одного конкретного заказа
  loading: boolean; // Индикатор загрузки
  error: string | null; // Ошибки
  newOrder: {
    orderModalData: TOrder | null; // Данные нового заказа
    loading: boolean; // Индикатор создания заказа
    error: string | null; // Ошибки создания заказа
  };
  allOrders: TAllOrders;
};

// Начальное состояние
const initialState: TOrderState = {
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,
  newOrder: {
    orderModalData: null,
    loading: false,
    error: null
  },
  allOrders: {
    orders: [],
    total: 0,
    totalToday: 0
  }
};

// Получение всех заказов пользователя
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Получение заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const order = await getOrderByNumberApi(orderNumber);
      return order.orders[0];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Создание нового заказа
export const createNewOrder = createAsyncThunk(
  'order/createNewOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const orderData = await orderBurgerApi(ingredientIds);
      return orderData.order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Получение данных всех заказов
export const fetchFeeds = createAsyncThunk(
  'order/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const feedData = await getFeedsApi();
      return feedData;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Слайс для управления заказами
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Сброс деталей заказа
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
    setNewOrder: (state, action: PayloadAction<TOrder>) => {
      state.newOrder.orderModalData = action.payload;
    },
    clearNewOrder: (state) => {
      state.newOrder.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    // Получение всех заказов пользователя
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Получение заказа по номеру
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.loading = false;
          state.orderDetails = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Создание нового заказа
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.newOrder.loading = true;
        state.newOrder.error = null;
      })
      .addCase(
        createNewOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.newOrder.loading = false;
          state.newOrder.orderModalData = action.payload;
        }
      )
      .addCase(createNewOrder.rejected, (state, action) => {
        state.newOrder.loading = false;
        state.newOrder.error = action.payload as string;
      });

    // Получение данных всех заказов
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeds.fulfilled,
        (state, action: PayloadAction<TAllOrders>) => {
          state.loading = false;
          state.allOrders = action.payload;
        }
      )
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrderDetails, clearNewOrder, setNewOrder } =
  orderSlice.actions;
export default orderSlice.reducer;
