import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { RootState } from "../../app/store";
import type { ChatInfo, ChatStatus } from "../../types/Chat";
import { getUserChats } from "../../api/chatApi";

import { getUsers, type ChatUser } from "../../api/userApi";

type ChatsState = {
  chats: ChatInfo[];
  users: ChatUser[];
  loading: boolean;
  usersLoading: boolean;
  error: string | null;
  statuses: ChatStatus[];
};

const initialState: ChatsState = {
  chats: [],
  users: [],
  loading: false,
  usersLoading: false,
  error: null,
  statuses: [],
};

export const fetchChats = createAsyncThunk<
  ChatInfo[],
  { statuses?: ChatStatus[] } | undefined,
  {
    state: RootState;
    rejectValue: string;
  }
>(
  "chats/fetchChats",
  async (params, { getState, rejectWithValue }) => {
    try {
      const { userId, tenantId } = getState().auth;

      if (userId == null) {
        throw new Error("User ID is missing.");
      }

      return await getUserChats({
        userId,
        tenantId,
        chatStatuses: params?.statuses,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load chats.";

      return rejectWithValue(message);
    }
  },
);

export const fetchChatUsers = createAsyncThunk<
  ChatUser[],
  number[],
  {
    state: RootState;
    rejectValue: string;
  }
>(
  "chats/fetchChatUsers",
  async (userIds, { getState, rejectWithValue }) => {
    try {
      const { tenantId } = getState().auth;

      return await getUsers(userIds, tenantId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load chat users.";

      return rejectWithValue(message);
    }
  },
);

const chatsSlice = createSlice({
  name: "chats",
  initialState,

  reducers: {
    setStatuses(state, action: { payload: ChatStatus[] }) {
      state.statuses = action.payload;
    },

    clearChats(state) {
      state.chats = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load chats.";
      })
      .addCase(fetchChatUsers.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(fetchChatUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchChatUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload ?? "Failed to load chat users.";
      });
  },
});
export const {
  setStatuses,
  clearChats,
} = chatsSlice.actions;

export default chatsSlice.reducer;

export const selectAllChats = (state: RootState) =>
  state.chats.chats;