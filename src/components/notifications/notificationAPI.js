import { getValueFor } from "../sessions/sessionAPI.js";
import { URL } from "@env";

const API_URL = URL;

export async function fetchNotifications() {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/notifications.json`, {
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

export async function createNotification(notification) {
  return fetch(`${API_URL}/notifications.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.auth_token}`,
    },
    body: JSON.stringify({ notification }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function updateNotification(payload) {
  const auth_token = await getValueFor("auth_token");

  return fetch(`${API_URL}/notifications/${payload.id}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ notification: payload }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function destroyNotification(payload) {
  const notification = payload.notification;

  return fetch(
    `${API_URL}/notifications/${notification.notification_id}.json`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.auth_token}`,
      },
      body: JSON.stringify({ notification }),
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}
