import { getValueFor } from "../../sessions/sessionAPI.js";
import { URL } from "@env";
const API_URL = URL;

export async function fetchInvites() {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/invites.json`, {
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

export async function fetchInvitesAndRequestsPending() {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/invites/pending.json`, {
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

export async function fetchRequests(group_id) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/${group_id}/requests`, {
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

export async function createInvite(inviteDetails) {
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/groups/${inviteDetails.group_id}/invites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ invite: inviteDetails }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function updateInvite(invite) {
  const auth_token = await getValueFor("auth_token");
  return fetch(
    `${API_URL}/groups/${invite.group_id}/invites/${invite.id}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ invite: invite.inviteDetails }),
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function updateRequest(invite) {
  const auth_token = await getValueFor("auth_token");
  return fetch(
    `${API_URL}/groups/${invite.group_id}/requests/${invite.id}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ invite: invite.inviteDetails }),
    }
  )
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}

export async function destroyInvite(payload) {
  const invite = payload.invite;
  const auth_token = await getValueFor("auth_token");
  return fetch(`${API_URL}/invites/${invite.invite_id}.json`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
    body: JSON.stringify({ invite }),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}
