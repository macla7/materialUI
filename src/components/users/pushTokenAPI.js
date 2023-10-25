import { getValueFor } from "../sessions/sessionAPI.js";
import { URL } from "@env";

const API_URL = URL;

export async function fetchPushTokens(userId) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/users/${userId}/push_tokens.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function createPushToken(pushToken) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/users/${pushToken.user_id}/push_tokens.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ pushToken }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function updatePushToken(pushToken) {
  const auth_token = await getValueFor("auth_token");

  // This is getting the pushToken_id from the profile formdata message
  return fetch(
    `${API_URL}/users/${pushToken.user_id}/push_tokens/${pushToken.id}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ pushToken }),
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function destroyPushToken(pushToken) {
  const auth_token = await getValueFor("auth_token");

  return fetch(
    `${API_URL}/users/${pushToken.user_id}/push_tokens/${pushToken.id}.json`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ pushToken }),
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}
