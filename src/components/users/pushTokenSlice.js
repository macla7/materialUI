import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import {
  fetchPushTokens,
  createPushToken,
  destroyPushToken,
  updatePushToken,
} from "./pushTokenAPI";

export const Statuses = {
  Initial: "Not Fetched",
  Loading: "Loading..",
  UpToDate: "Up To Date",
  Deleted: "Deleted",
  Error: "Error",
};

const initialState = {
  pushTokens: [
    {
      id: 0,
      user_id: 0,
      device_id: "",
      push_token: "",
      updated_at: "",
      created_at: "",
    },
  ],
  currentPushToken: {
    id: 0,
    user_id: 0,
    device_id: "",
    push_token: "",
    updated_at: "",
    created_at: "",
  },
  status: Statuses.Initial,
};

export const fetchPushTokensAsync = createAsyncThunk(
  "pushTokens/fetchPushTokens",
  async (userId) => {
    const response = await fetchPushTokens(userId);
    return response;
  }
);

export const createPushTokenAsync = createAsyncThunk(
  "pushTokens/createPushToken",
  async (pushTokenDetails) => {
    const response = await createPushToken(pushTokenDetails);
    return response;
  }
);

export const updatePushTokenAsync = createAsyncThunk(
  "pushTokens/updatePushToken",
  async (pushTokenDetails) => {
    const response = await updatePushToken(pushTokenDetails);
    return response;
  }
);

export const destroyPushTokenAsync = createAsyncThunk(
  "pushTokens/destroyPushToken",
  async (payload) => {
    const response = await destroyPushToken(payload);
    return response;
  }
);

export const pushTokenSlice = createSlice({
  name: "pushToken",
  initialState,
  reducers: {
    setCurrentPushToken: (state, action) => {
      state.currentPushToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // while you wait
      .addCase(fetchPushTokensAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      // you got the thing
      .addCase(fetchPushTokensAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.pushTokens = action.payload;
          draftState.status = Statuses.UpToDate;
        });
      })
      // error
      .addCase(fetchPushTokensAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      })
      // while you wait
      .addCase(createPushTokenAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      // you got the thing
      .addCase(createPushTokenAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.currentPushToken = action.payload.currentPushToken;
          draftState.status = Statuses.UpToDate;
        });
      })
      // error
      .addCase(createPushTokenAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      })
      .addCase(destroyPushTokenAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      // you got the thing
      .addCase(destroyPushTokenAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.pushTokens = action.payload;
          draftState.status = Statuses.UpToDate;
        });
      })
      // error
      .addCase(destroyPushTokenAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      })
      .addCase(updatePushTokenAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      // you got the thing
      .addCase(updatePushTokenAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.currentPushToken = action.payload.currentPushToken;
          draftState.status = Statuses.UpToDate;
        });
      })
      // error
      .addCase(updatePushTokenAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      });
  },
});

export const { setCurrentPushToken } = pushTokenSlice.actions;

export const selectPushTokens = (state) => state.pushTokens.pushTokens;

export const selectCurrentPushToken = (state) =>
  state.pushTokens.currentPushToken;

export default pushTokenSlice.reducer;
