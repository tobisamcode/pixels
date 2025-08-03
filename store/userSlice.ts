import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  apiService,
  LoginRequest,
  LoginResponse,
  BankAccount as ApiBankAccount,
} from "@/services/api";

export interface BankAccount {
  id: string;
  accountNumber: string;
  accountType: "Checking" | "Savings" | "Credit";
  balance: number;
  currency: string;
  cardColor: string;
  bankName: string;
}

export interface UserState {
  id: string | null;
  name: string | null;
  username: string | null;
  email: string | null;
  token: string | null;
  isLoggedIn: boolean;
  bankAccounts: BankAccount[];
  loading: boolean;
  error: string | null;
  biometricEnabled: boolean;
  biometricType: string | null;
}

// Async thunks
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const fetchBankAccounts = createAsyncThunk(
  "user/fetchBankAccounts",
  async (userId: string, { rejectWithValue }) => {
    try {
      const accounts = await apiService.getBankAccounts(userId);
      return accounts;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch bank accounts");
    }
  }
);

const initialState: UserState = {
  id: null,
  name: null,
  username: null,
  email: null,
  token: null,
  isLoggedIn: false,
  bankAccounts: [],
  loading: false,
  error: null,
  biometricEnabled: false,
  biometricType: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.id = null;
      state.name = null;
      state.username = null;
      state.email = null;
      state.token = null;
      state.isLoggedIn = false;
      state.bankAccounts = [];
      state.loading = false;
      state.error = null;
      // Keep biometric settings on logout
    },
    clearError: (state) => {
      state.error = null;
    },
    setBiometricEnabled: (
      state,
      action: PayloadAction<{ enabled: boolean; biometricType: string }>
    ) => {
      state.biometricEnabled = action.payload.enabled;
      state.biometricType = action.payload.biometricType;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.id = action.payload.id;
          state.name = action.payload.name;
          state.username = action.payload.username;
          state.email = action.payload.email;
          state.token = action.payload.token;
          state.isLoggedIn = true;
          state.error = null;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoggedIn = false;
      })
      // Bank accounts cases
      .addCase(fetchBankAccounts.pending, (state) => {
        // Only set loading if we don't already have accounts (avoid loading state on refresh)
        if (state.bankAccounts.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(
        fetchBankAccounts.fulfilled,
        (state, action: PayloadAction<ApiBankAccount[]>) => {
          state.loading = false;
          state.bankAccounts = action.payload.map((account) => ({
            id: account.id,
            accountNumber: account.accountNumber,
            accountType: account.accountType,
            balance: account.balance,
            currency: account.currency,
            cardColor: account.cardColor,
            bankName: account.bankName,
          }));
          state.error = null;
        }
      )
      .addCase(fetchBankAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setBiometricEnabled } = userSlice.actions;
export default userSlice.reducer;
