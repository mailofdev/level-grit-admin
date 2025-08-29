// src/features/users/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserList,
  deleteUserById,
  registerUser,
  updateUserById,
  getUserById,
} from "../../api/authAPI";

// Fetch all users
export const fetchUsers = createAsyncThunk("users/getUserList", async (_, { rejectWithValue }) => {
  try {
    const data = await getUserList();
    return [...data].reverse();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
  }
});

// Delete multiple users
export const removeUsers = createAsyncThunk("users/remove", async (ids, { rejectWithValue }) => {
  try {
    await Promise.all(ids.map(id => deleteUserById(id)));
    return ids;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete users");
  }
});

// Fetch single user
export const fetchUserById = createAsyncThunk("users/fetchOne", async (id, { rejectWithValue }) => {
  try {
    return await getUserById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "User not found");
  }
});

// Add user
export const addUser = createAsyncThunk("users/add", async (data, { rejectWithValue }) => {
  try {
    return await registerUser(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add user");
  }
});

// Update user
export const editUser = createAsyncThunk("users/edit", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateUserById(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update user");
  }
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(removeUsers.fulfilled, (state, action) => {
        state.list = state.list.filter(u => !action.payload.includes(u._id));
      })

      // Fetch one
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })

      // Add
      .addCase(addUser.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // Edit
      .addCase(editUser.fulfilled, (state, action) => {
        state.list = state.list.map(u => (u._id === action.payload._id ? action.payload : u));
      });
  },
});

export const { clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
