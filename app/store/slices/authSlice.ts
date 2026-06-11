import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import { apiRequest } from "@/app/utils/apiHelper";
import { Endpoint } from "@/app/utils/const";



export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken?: string;
  refreshToken?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // restore
      .addCase(restoreUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(restoreUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })

      //login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      //logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
})


export const restoreUser = createAsyncThunk('auth/restoreUser', async (_, { rejectWithValue }) => {
  try {
    const token = await SecureStore.getItemAsync('user_token');
    if (!token) return null;

    const user = await apiRequest<User>(Endpoint.DETAIL_USER, {
      method: 'GET',
    });

    return { user, token };
  } catch (error: any) {
    console.error('gagal restore session', error);

    //delete local
    await SecureStore.deleteItemAsync('user_session');
    await SecureStore.deleteItemAsync('user_token');
    return null;
  }
});

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password?: string }, { rejectWithValue }) => {
    try {
      const response = await apiRequest<User>(Endpoint.LOGIN, {
        method: 'POST',
        body: {
          username: credentials.username.trim(),
          password: credentials.password,
          expiresInMins: 30,
        },
      });

      // save token & seesion
      await SecureStore.setItemAsync('user_session', JSON.stringify(response));
      if (response.accessToken) {
        await SecureStore.setItemAsync('user_token', response.accessToken);
      }

      return { user: response, token: response.accessToken || null };
    } catch (error: any) {
      return rejectWithValue(error.message || 'gagal login');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await SecureStore.deleteItemAsync('user_session');
    await SecureStore.deleteItemAsync('user_token');
  } catch (error) {
    console.error('gagal clean local storage', error);
  }
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;