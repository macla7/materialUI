import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import {
  registerUser,
  loginUser,
  logoutUser,
  loginUserWithToken,
} from "./sessionAPI";
import * as SecureStore from "expo-secure-store";
import { client_id, client_secret } from "@env";

export async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export async function deleteValueFor(key) {
  await SecureStore.deleteItemAsync(key);
}

export const Statuses = {
  Initial: "Not Fetched",
  Loading: "Loading..",
  UpToDate: "Up To Date",
  Error: "Error",
};

const initialState = {
  status: Statuses.Initial,
  goToRegister: false,
  auth_token: null,
  loginError: "",
  newUser: false,
  user: {
    id: null,
    username: null,
    email: null,
    avatar: null,
    avatar_url: null,
  },
};

export const registerUserAsync = createAsyncThunk(
  "sessions/registerUser",
  async (payload) => {
    payload.client_id = client_id;
    const response = await registerUser(payload);
    return response;
  }
);

export const loginUserAsync = createAsyncThunk(
  "sessions/loginUser",
  async (payload) => {
    payload.grant_type = "password";
    payload.client_id = client_id;
    payload.client_secret = client_secret;
    const response = await loginUser(payload);
    return response;
  }
);

export const logoutUserAsync = createAsyncThunk(
  "sessions/logoutUser",
  async () => {
    payload = {};
    payload.client_id = client_id;
    payload.client_secret = client_secret;
    const response = await logoutUser(payload);
    return response;
  }
);

export const loginUserWithTokenAsync = createAsyncThunk(
  "sessions/loginUserWithToken",
  async () => {
    const payload = {
      client_id: client_id,
    };
    const response = await loginUserWithToken(payload);
    return response;
  }
);

export const sessionSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    goToRegister: (state) => {
      state.goToRegister = true;
    },
    goToLogin: (state) => {
      state.goToRegister = false;
    },
    clearLoginError: (state) => {
      state.loginError = "";
    },
    noLongerNewUser: (state) => {
      state.newUser = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // while you wait
      .addCase(registerUserAsync.pending, (state) => {
        return produce(state, (draftState) => {
          // draftState.status = Statuses.Loading;
        });
      })
      // you got the thing
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState["user"] = {
            id: action.payload.user.id,
            email: action.payload.user.email,
            avatar: action.payload.user.avatar,
            avatar_url: action.payload.user.avatar_url,
          };
          draftState.auth_token = action.payload.access_token;
          draftState.newUser = true;
          // default headers set >>>??!!
          save("auth_token", action.payload.access_token);
        });
      })
      // error
      .addCase(registerUserAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          // draftState.status = Statuses.Error;
        });
      })
      // while you wait
      .addCase(loginUserAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      // you got the thing
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.UpToDate;
          if (action.payload.user == undefined) {
            draftState.loginError = "Login details are incorrect";
          } else {
            draftState["user"] = {
              id: action.payload.user.id,
              email: action.payload.user.email,
              avatar: action.payload.user.avatar,
              avatar_url: action.payload.user.avatar_url,
            };
            draftState.auth_token = action.payload.access_token;
            save("auth_token", action.payload.access_token);
          }
        });
      })
      // error
      .addCase(loginUserAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      })
      // while you wait
      .addCase(logoutUserAsync.pending, (state) => {
        return produce(state, (draftState) => {
          // draftState.status = Statuses.Loading;
        });
      })
      // you got the thing
      .addCase(logoutUserAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.user = {
            id: null,
            email: null,
          };
          draftState.auth_token = null;
          deleteValueFor("auth_token");
        });
      })
      // error
      .addCase(logoutUserAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          // draftState.status = Statuses.Error;
        });
      })
      // while you wait
      .addCase(loginUserWithTokenAsync.pending, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Loading;
        });
      })
      // you got the thing
      .addCase(loginUserWithTokenAsync.fulfilled, (state, action) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.UpToDate;
          if (action.payload.user !== undefined) {
            draftState["user"] = {
              id: action.payload.user.id,
              email: action.payload.user.email,
              avatar: action.payload.user.avatar,
              avatar_url: action.payload.user.avatar_url,
            };
            draftState.auth_token = action.payload.access_token;
          }
        });
      })
      // error
      .addCase(loginUserWithTokenAsync.rejected, (state) => {
        return produce(state, (draftState) => {
          draftState.status = Statuses.Error;
        });
      });
  },
});

export const selectStatus = (state) => state.sessions.status;

export const selectUserEmail = (state) => state.sessions.user?.email;

export const selectUserId = (state) => state.sessions.user?.id;

export const selectUserAvatar = (state) => state.sessions.user?.avatar;

export const selectUserAvatarUrl = (state) => state.sessions.user?.avatar_url;

export const selectLoginError = (state) => state.sessions.loginError;

export const selectNewUser = (state) => state.sessions.newUser;

export const selectIsLoggedIn = (state) => {
  const loggedOut =
    state.sessions.auth_token == null ||
    state.sessions.auth_token === JSON.stringify(null);
  return !loggedOut;
};

export const selectAuthToken = (state) => state.sessions.auth_token;

export const { clearLoginError, noLongerNewUser } = sessionSlice.actions;

export default sessionSlice.reducer;
