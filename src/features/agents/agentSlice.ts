import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as agentApi from "../../api/agentApi";
import type { Agent } from "../../types/Agent";

type AgentsState = {
  agents: Agent[];
  agentsAndBots: Agent[];
  loading: boolean;
  error: string | null;
};

type ThunkState = {
  auth: {
    tenantId: string | null;
  };
};

const initialState: AgentsState = {
  agents: [],
  agentsAndBots: [],
  loading: false,
  error: null,
};

export const fetchAgents = createAsyncThunk<
  Agent[],
  void,
  { state: ThunkState; rejectValue: string }
>(
  "agents/fetchAgents",
  async (_, { getState, rejectWithValue }) => {
    try {
      const tenantId = getState().auth.tenantId;

      return await agentApi.getAgents(tenantId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load agents";

      return rejectWithValue(message);
    }
  },
);

export const fetchAgentsAndBots = createAsyncThunk<
  Agent[],
  void,
  { state: ThunkState; rejectValue: string }
>(
  "agents/fetchAgentsAndBots",
  async (_, { getState, rejectWithValue }) => {
    try {
      const tenantId = getState().auth.tenantId;

      return await agentApi.getAgentsAndBots(tenantId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load agents and bots";

      return rejectWithValue(message);
    }
  },
);

export const createAgentThunk = createAsyncThunk<
  void,
  Agent,
  { state: ThunkState; rejectValue: string }
>(
  "agents/createAgent",
  async (agent, { getState, dispatch, rejectWithValue }) => {
    try {
      const tenantId = getState().auth.tenantId;

      await agentApi.createAgent(agent, tenantId);

      await dispatch(fetchAgents()).unwrap();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create agent";

      return rejectWithValue(message);
    }
  },
);

export const updateAgentThunk = createAsyncThunk<
  void,
  Agent,
  { state: ThunkState; rejectValue: string }
>(
  "agents/updateAgent",
  async (agent, { getState, dispatch, rejectWithValue }) => {
    try {
      const tenantId = getState().auth.tenantId;

      await agentApi.updateAgent(agent, tenantId);

      await dispatch(fetchAgents()).unwrap();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update agent";

      return rejectWithValue(message);
    }
  },
);

export const deleteAgentThunk = createAsyncThunk<
  number,
  number,
  { state: ThunkState; rejectValue: string }
>(
  "agents/deleteAgent",
  async (agentId, { getState, rejectWithValue }) => {
    try {
      const tenantId = getState().auth.tenantId;

      await agentApi.deleteAgent(agentId, tenantId);

      return agentId;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete agent";

      return rejectWithValue(message);
    }
  },
);

const agentSlice = createSlice({
  name: "agents",
  initialState,

  reducers: {
    clearAgents(state) {
      state.agents = [];
      state.agentsAndBots = [];
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // -------------------------
      // Fetch agents
      // -------------------------
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload;
      })

      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to load agents";
      })

      // -------------------------
      // Fetch agents + bots
      // -------------------------
      .addCase(fetchAgentsAndBots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAgentsAndBots.fulfilled, (state, action) => {
        state.loading = false;
        state.agentsAndBots = action.payload;
      })

      .addCase(fetchAgentsAndBots.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to load agents and bots";
      })

      // -------------------------
      // Create agent
      // -------------------------
      .addCase(createAgentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createAgentThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(createAgentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to create agent";
      })

      // -------------------------
      // Update agent
      // -------------------------
      .addCase(updateAgentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateAgentThunk.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(updateAgentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to update agent";
      })

      // -------------------------
      // Delete agent
      // -------------------------
      .addCase(deleteAgentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteAgentThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.agents = state.agents.filter(
          (agent) => agent.userId !== action.payload,
        );

        state.agentsAndBots = state.agentsAndBots.filter(
          (agent) => agent.userId !== action.payload,
        );
      })

      .addCase(deleteAgentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to delete agent";
      });
  },
});

export const { clearAgents } = agentSlice.actions;

export default agentSlice.reducer;

