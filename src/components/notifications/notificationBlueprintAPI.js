import { getValueFor } from "../sessions/sessionAPI.js";
import { URL } from "@env";

const API_URL = URL;

export async function fetchNotificationBlueprints() {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/notification_blueprints.json`, {
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

export async function createNotificationBlueprint(notification_blueprint) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/notification_blueprints.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ notification_blueprint }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function updateNotificationBlueprint(payload) {
  const notification_blueprint = payload.notification_blueprint;

  return fetch(
    `${API_URL}/notification_blueprints/${notification_blueprint.id}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.auth_token}`,
      },
      body: JSON.stringify({ notification_blueprint }),
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function destroyNotificationBlueprint(payload) {
  const notification_blueprint = payload.notification_blueprint;

  return fetch(
    `${API_URL}/notification_blueprints/${notification_blueprint.notification_blueprint_id}.json`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.auth_token}`,
      },
      body: JSON.stringify({ notification_blueprint }),
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}
