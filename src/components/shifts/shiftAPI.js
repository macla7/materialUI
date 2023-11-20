import { getValueFor } from "../sessions/sessionAPI.js";
import { URL } from "@env";

const API_URL = URL;

export async function fetchShifts(userId) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/users/${userId}/shifts.json`, {
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

export async function fetchShiftsForMonth(userAndMonth) {
  const auth_token = await getValueFor("auth_token");
  return fetch(
    `${API_URL}/users/${userAndMonth.userId}/for_month?month=${userAndMonth.month}.json`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function createShift(shiftDetails) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/users/${shiftDetails.user_id}/shifts.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ shift: shiftDetails }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function destroyShift(shiftDetails) {
  const auth_token = await getValueFor("auth_token");
  return fetch(
    `${API_URL}/users/${shiftDetails.user_id}/shifts/${shiftDetails.id}.json`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function updateShift(shiftDetails) {
  const auth_token = await getValueFor("auth_token");

  // This is getting the user_id from the profile formdata message
  return fetch(
    `${API_URL}/users/${shiftDetails.user_id}/shifts/${shiftDetails.id}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ shift: shiftDetails }),
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}
