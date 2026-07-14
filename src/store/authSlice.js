import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    console.log("Attempting to login with:", username, password);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (username === "shabnam" && password === "password") {
      const userData = {
        id: "user1",
        name: username,
        displayName: "shabnam mahmoudi",
        token: "mock-token-123",
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      return userData;
    } else {
      return rejectWithValue("نام کاربری یا رمز عبور اشتباه است.");
    }
  },
);

const initialState = {
  user: JSON.parse(localStorage.getItem("userData")) || null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("userData"); // Clear from localStorage
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null; // Clear previous errors on new attempt
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        // action.payload contains the value returned by rejectWithValue
        // action.error.message contains the default error message
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
