import { getValueFor } from "../../sessions/sessionAPI.js";
import { URL } from "@env";

const API_URL = URL;

export async function fetchBids(postId) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/posts/${postId}/bids.json`, {
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

export async function createBid(bidDetails) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/bids.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ bid: bidDetails }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function updateBid(payload) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/bids/bulk_update.json`, {
    method: "PUT",
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
