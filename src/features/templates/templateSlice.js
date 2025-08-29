import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTemplateList,
  deleteTemplateById,
  createTemplate,
  updateTemplateById,
  getTemplateById,
} from "../../api/templatesAPI";

// Fetch all templates
export const fetchTemplates = createAsyncThunk("templates/getAll", async (_, { rejectWithValue }) => {
  try {
    const data = await getTemplateList();
    return [...data].reverse();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch templates");
  }
});

// Delete multiple templates
export const removeTemplates = createAsyncThunk("templates/remove", async (ids, { rejectWithValue }) => {
  try {
    await Promise.all(ids.map(id => deleteTemplateById(id)));
    return ids;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete templates");
  }
});

// Fetch single template
export const fetchTemplateById = createAsyncThunk("templates/fetchOne", async (id, { rejectWithValue }) => {
  try {
    return await getTemplateById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Template not found");
  }
});

// Add template
export const addTemplate = createAsyncThunk("templates/add", async (data, { rejectWithValue }) => {
  try {
    return await createTemplate(data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add template");
  }
});

// Update template
export const editTemplate = createAsyncThunk("templates/edit", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updateTemplateById(id, data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to update template");
  }
});

const templateSlice = createSlice({
  name: "templates",
  initialState: {
    list: [],
    currentTemplate: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(removeTemplates.fulfilled, (state, action) => {
        state.list = state.list.filter(t => !action.payload.includes(t._id));
      })

      // Fetch one
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.currentTemplate = action.payload;
      })

      // Add
      .addCase(addTemplate.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // Edit
      .addCase(editTemplate.fulfilled, (state, action) => {
        state.list = state.list.map(t => (t._id === action.payload._id ? action.payload : t));
      });
  },
});

export const { clearCurrentTemplate } = templateSlice.actions;
export default templateSlice.reducer;
