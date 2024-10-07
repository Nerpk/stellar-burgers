import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData,
  fetchWithRefresh
} from '@api';
import { getCookie } from '../../utils/cookie';
import { storeTokens } from '../../utils/tokens';
import { TUser } from '@utils-types';

interface UserState {
  user: {
    email: string;
    name: string;
  } | null;
  isLoading: boolean;
  isAuth: boolean;
  error: string | undefined;
}

const initialState: UserState = {
  user: {
    email: '',
    name: ''
  },
  isLoading: false,
  isAuth: false,
  error: undefined
};

// Асинхронный экшен для регистрации пользователя
export const registerUser = createAsyncThunk(
    'user/register',
    async (userData: TRegisterData, { rejectWithValue }) => {
      try {
        const response = await registerUserApi(userData);
        if (!response?.success) {
          return rejectWithValue(null);
        }
        storeTokens(response.refreshToken, response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        return response.user;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
  );
  
  // Асинхронный экшен для авторизации пользователя
export const loginUser = createAsyncThunk(
    'user/login',
    async (loginData: TLoginData, { rejectWithValue }) => {
      try {
        const response = await loginUserApi(loginData);
        if (!response.success) {
          return rejectWithValue(response); 
        }
        
        localStorage.setItem('user', JSON.stringify(response.user));
        storeTokens(response.refreshToken, response.accessToken);
        return response.user;
      } catch (error) {
        return rejectWithValue(error);
      }
    }
);
  
export const restoreUser = createAsyncThunk(
    'user/restoreUser',
    async (_, { dispatch }) => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        dispatch(setAuth(true));
        dispatch(setUser(user))
      }
    }
);

// Асинхронный экшен для обновления данных пользователя
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      return response.user; 
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Асинхронный экшен для выхода из системы
export const logoutUser = createAsyncThunk('user/logout', async () => {
    await logoutApi();
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
        state.user = action.payload;
    },
    outUser: (state) => {
        state.user = null;
        state.isAuth = false;
    }
  },
  extraReducers: (builder) => {
    // Регистрация
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Авторизация
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Обновление данных
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Выход из системы
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuth = false;
    });
  }
});

export const { setAuth, setUser, outUser } = userSlice.actions;

export default userSlice.reducer;
