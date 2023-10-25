import * as SecureStore from "expo-secure-store";
import { URL } from "@env";

const API_URL = URL;

export async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

export async function registerUser(payload) {
  return fetch(`${API_URL}/users`, {
    method: "POST",
    body: payload,
  })
    .then(async (response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function loginUser(payload) {
  console.log("is this being hit");
  return fetch(`${API_URL}/users/session-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function logoutUser(payload) {
  const auth_token = await getValueFor("auth_token");

  return fetch(`${API_URL}/oauth/revoke.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function loginUserWithToken(payload) {
  const auth_token = await getValueFor("auth_token");

  return fetch(`${API_URL}/users/session-data/with-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}
