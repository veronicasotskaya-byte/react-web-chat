import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Bot } from "../../types/Bot";
import * as botApi from "../../api/botApi";

type BotsState = {
  bots: Bot[];
  loading: boolean;
  error: string | null;
  token: string | null;
};

type ThunkState = {
  auth: {
    tenantId: string | null;
  };
};

const initialState: BotsState = {
  bots: [],
  loading: false,
  error: null,
  token: null,
};

export const fetchBots = createAsyncThunk(
  "bots/fetchBots",
  async (_, { getState, rejectWithValue }) => {
    try {
      const tenantId = (getState() as ThunkState).auth.tenantId;
      return await botApi.getBots(tenantId);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load bots";
      return rejectWithValue(message);
    }
  },
);

export const saveBotThunk = createAsyncThunk<
  number,
  Bot,
  { rejectValue: string; state: ThunkState }
>("bots/saveBot", async (bot, { getState, dispatch, rejectWithValue }) => {
  try {
    const tenantId = getState().auth.tenantId;
    const botId = await botApi.saveBot(bot, tenantId);
    await dispatch(fetchBots()).unwrap();
    return botId;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to save bot";
    return rejectWithValue(message);
  }
});

export const deleteBotThunk = createAsyncThunk(
  "bots/deleteBot",
  async (botId: number, { getState, rejectWithValue }) => {
    try {
      const tenantId = (getState() as ThunkState).auth.tenantId;
      await botApi.deleteBot(botId, tenantId);
      return botId;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete bot";
      return rejectWithValue(message);
    }
  },
);

export const getBotTokenThunk = createAsyncThunk<
  string | null,
  number,
  { state: ThunkState; rejectValue: string }
>("bots/getBotToken", async (botId, { getState, rejectWithValue }) => {
  try {
    const tenantId = getState().auth.tenantId;
    const result = await botApi.getBotToken(botId, tenantId);
    return (result?.formattedToken as string | null | undefined) ?? null;
  } catch {
    return rejectWithValue("Failed to load token");
  }
});

export const regenerateBotTokenThunk = createAsyncThunk<
  string,
  number,
  { state: ThunkState; rejectValue: string }
>("bots/regenerateBotToken", async (botId, { getState, rejectWithValue }) => {
  try {
    const tenantId = getState().auth.tenantId;
    const result = await botApi.saveBotToken(botId, tenantId);
    const token = (result?.formattedToken as string | null | undefined) ?? "";

    if (!token) {
      return rejectWithValue("Failed to regenerate token");
    }

    return token;
  } catch {
    return rejectWithValue("Failed to regenerate token");
  }
});


const botSlice = createSlice({
  name: "bots",
  initialState,
  reducers: {
    clearBots(state) {
      state.bots = [];
      state.error = null;
      state.loading = false;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBots.fulfilled, (state, action) => {
        state.loading = false;
        state.bots = action.payload;
      })
      .addCase(fetchBots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBotThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBotThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bots = state.bots.filter((bot) => bot.botId !== action.payload);
      })
      .addCase(deleteBotThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getBotTokenThunk.fulfilled, (state, action) => {
  state.token = action.payload;
})

.addCase(regenerateBotTokenThunk.fulfilled, (state, action) => {
  state.token = action.payload;
  });
  },
});

export const { clearBots } = botSlice.actions;

export default botSlice.reducer;
