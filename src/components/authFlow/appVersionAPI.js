import { REGULAR_URL } from "@env";

export async function fetchAppVersion() {
  return fetch(`${REGULAR_URL}/app_version/latest.json`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error: ", error);
      // Not a longer term proper soloution
      return {};
    });
}
