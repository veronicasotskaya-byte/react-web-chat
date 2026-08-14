import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import * as widgetApi from "../../api/widgetApi";

import type { Widget } from "../../types/Widget";

type WidgetsState = {
  widgets: Widget[];
  loading: boolean;
  error: string | null;
  saving: boolean;
};

type ThunkState = {
  auth: {
    tenantId: string | null;
  };
};

const initialState: WidgetsState = {
  widgets: [],
  loading: false,
  error: null,
  saving: false,
};

export const fetchWidgets = createAsyncThunk<
  Widget[],
  void,
  { rejectValue: string; state: ThunkState }
>("widgets/fetchWidgets", async (_, { getState, rejectWithValue }) => {
  try {
    const tenantId = getState().auth.tenantId;

    return await widgetApi.getWidgets(tenantId);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load widgets";

    return rejectWithValue(message);
  }
});

export const saveWidgetThunk = createAsyncThunk<
  number,
  Widget,
  { rejectValue: string; state: ThunkState }
>("widgets/saveWidget", async (widget, { getState, dispatch, rejectWithValue }) => {
  try {
    const tenantId = getState().auth.tenantId;

    if (!tenantId && !widget.tenantId) {
      return rejectWithValue(
        "Tenant ID is missing. Please sign in again.",
      );
    }

    /*
     * Normalize agents:
     * priority is determined by their order in the array.
     */
    const normalizedAgents = widget.agents.map((agent, index) => ({
      ...agent,
      priority: index + 1,
    }));

    /*
     * Normalize allowed origins.
     *
     * Example:
     * https://example.com/some/path
     * becomes:
     * https://example.com
     */
    const normalizedOrigins = widget.allowedOrigins
      .map((origin) => origin.trim())
      .filter((origin) => origin !== "")
      .map((origin) => {
        try {
          return new URL(origin).origin;
        } catch {
          return origin;
        }
      });

    const normalizedWidget: Widget = {
      ...widget,
      /*
       * API expects System.Guid — null/empty fails model binding.
       */
      tenantId: widget.tenantId || tenantId,
      agents: normalizedAgents,
      allowedOrigins: normalizedOrigins,
      verifyExternalId: null,
    };

    const widgetId = await widgetApi.saveWidget(
      normalizedWidget,
      tenantId,
    );

    await dispatch(fetchWidgets()).unwrap();

    return widgetId;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to save widget";

    return rejectWithValue(message);
  }
});

export const deleteWidgetThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: string; state: ThunkState }
>(
  "widgets/deleteWidget",
  async (widgetId, { getState, rejectWithValue }) => {
    try {
      const tenantId = getState().auth.tenantId;

      await widgetApi.deleteWidget(widgetId, tenantId);

      return widgetId;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete widget";

      return rejectWithValue(message);
    }
  },
);

export const rotatePublicWidgetIdThunk = createAsyncThunk<
  { widgetId: number; publicWidgetId: string | null },
  number,
  { rejectValue: string; state: ThunkState }
>(
  "widgets/rotatePublicWidgetId",
  async (widgetId, { getState, rejectWithValue }) => {
    try {
      const tenantId = getState().auth.tenantId;

      const publicWidgetId =
        await widgetApi.rotatePublicWidgetId(
          widgetId,
          tenantId,
        );

      return {
        widgetId,
        publicWidgetId: publicWidgetId ?? null,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to rotate public widget ID";

      return rejectWithValue(message);
    }
  },
);

const widgetsSlice = createSlice({
  name: "widgets",
  initialState,
  reducers: {
    clearWidgets(state) {
      state.widgets = [];
      state.loading = false;
      state.error = null;
      state.saving = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchWidgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWidgets.fulfilled, (state, action) => {
        state.loading = false;
        state.widgets = action.payload;
      })

      .addCase(fetchWidgets.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to load widgets";
      })

      // SAVE
      .addCase(saveWidgetThunk.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(saveWidgetThunk.fulfilled, (state) => {
        state.saving = false;
      })

      .addCase(saveWidgetThunk.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload ?? "Failed to save widget";
      })

      // DELETE
      .addCase(deleteWidgetThunk.pending, (state) => {
        state.error = null;
      })

      .addCase(deleteWidgetThunk.fulfilled, (state, action) => {
        state.widgets = state.widgets.filter(
          (widget) => widget.widgetId !== action.payload,
        );
      })

      .addCase(deleteWidgetThunk.rejected, (state, action) => {
        state.error =
          action.payload ?? "Failed to delete widget";
      })

      // ROTATE PUBLIC ID
      .addCase(
        rotatePublicWidgetIdThunk.fulfilled,
        (state, action) => {
          const widget = state.widgets.find(
            (item) => item.widgetId === action.payload.widgetId,
          );

          if (widget) {
            widget.publicWidgetId =
              action.payload.publicWidgetId;
          }
        },
      )

      .addCase(
        rotatePublicWidgetIdThunk.rejected,
        (state, action) => {
          state.error =
            action.payload ??
            "Failed to rotate public widget ID";
        },
      );
  },
});

export const { clearWidgets } = widgetsSlice.actions;

export default widgetsSlice.reducer;

