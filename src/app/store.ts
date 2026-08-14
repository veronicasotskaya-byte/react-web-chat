import { configureStore } from "@reduxjs/toolkit";
import agentReducer from "../features/agents/agentSlice";
import botReducer from "../features/bots/botSlice";
import authReducer from "../features/auth/authSlice";
import widgetsReducer from "../features/widgets/widgetsSlice";
import chatsReducer from "../features/chat/chatsSlice";

function loadAuthState(): ReturnType<typeof authReducer> | undefined {
  try {
    const savedState = localStorage.getItem("appState");

    if (!savedState) {
      return undefined;
    }

    const parsed = JSON.parse(savedState) as {
      auth?: ReturnType<typeof authReducer>;
    };

    return parsed.auth;
  } catch {
    return undefined;
  }
}

const savedAuth = loadAuthState();

export const store = configureStore({
  reducer: {
    agents: agentReducer,
    bots: botReducer,
    auth: authReducer,
    widgets: widgetsReducer,
    chats: chatsReducer,
  },
  preloadedState: savedAuth ? { auth: savedAuth } : undefined,
});

store.subscribe(() => {
  const { auth } = store.getState();
  localStorage.setItem("appState", JSON.stringify({ auth }));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
