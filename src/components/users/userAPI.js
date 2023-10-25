import { getValueFor } from "../sessions/sessionAPI.js";
import { URL } from "@env";

const API_URL = URL;

export async function fetchUsers(groupId) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/groups/${groupId}/users.json`, {
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

export async function fetchUser(userId) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/users/${userId}.json`, {
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

export async function createUser(user) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/users.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ user }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function updateUser(payload) {
  const auth_token = await getValueFor("auth_token");

  // This is getting the user_id from the profile formdata message
  return fetch(`${API_URL}/users/${payload["_parts"][0][1]}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: payload,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function destroyUser(userId) {
  const auth_token = await getValueFor("auth_token");

  return fetch(`${API_URL}/users/${userId}.json`, {
    method: "DELETE",
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
