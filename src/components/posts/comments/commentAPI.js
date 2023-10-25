import { getValueFor } from "../../sessions/sessionAPI.js";
import { URL } from "@env";

const API_URL = URL;

export async function fetchComments(postId) {
  return fetch(`${API_URL}/posts/${postId}/comments.json`, {
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

export async function createComment(commentDetails) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/comments.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ comment: commentDetails }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function updateComment(commentDetails) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/comments/${commentDetails.id}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ comment: commentDetails.comment }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}
