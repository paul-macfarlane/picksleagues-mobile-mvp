import {
  getAccessToken,
  refreshAccessToken,
} from "~/lib/services/auth-service";

// todo replace with env var
const API_URL = "https://www.picksleagues.com/api/mobile";

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  let accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  let response = await fetch(`${API_URL}${endpoint}`, requestOptions);
  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();

      requestOptions.headers = {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      };

      response = await fetch(`${API_URL}${endpoint}`, requestOptions);
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw new Error("Authentication expired. Please sign in again.");
    }
  }

  return response;
}
