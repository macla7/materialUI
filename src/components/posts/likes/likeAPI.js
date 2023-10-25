import { getValueFor } from "../../sessions/sessionAPI.js";
import { URL } from "@env";

const API_URL = URL;

export async function fetchLikes(postId) {
  return fetch(`${API_URL}/posts/${postId}/likes.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.auth_token}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function createLike(likeDetails) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/likes.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ like: likeDetails }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function destroyLike(likeDetails) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/likes/destroy.json`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ like: likeDetails }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}
