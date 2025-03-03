import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

// todo replace with env var
const API_URL = "https://www.picksleagues.com/api/mobile";
const AUTH_ENDPOINT = `${API_URL}/auth`;
const REFRESH_ENDPOINT = `${AUTH_ENDPOINT}/refresh`;

const ACCESS_TOKEN_KEY = "picksleagues_access_token";
const REFRESH_TOKEN_KEY = "picksleagues_refresh_token";
const USER_DATA_KEY = "picksleagues_user_data";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserData = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  username: string | null;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  userData: UserData;
  isNewUser: boolean;
};

export async function initiateOAuthFlow(
  provider: "google" | "discord"
): Promise<AuthResponse> {
  try {
    const authUrl = `${AUTH_ENDPOINT}/${provider}/authorize`;
    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      "picksleagues://"
    );

    if (result.type === "success" && result.url) {
      const url = new URL(result.url);
      const params = new URLSearchParams(url.search);

      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");
      const userData = params.get("userData");
      const isNewUser = params.get("isNewUser") === "true";
      if (!accessToken || !refreshToken || !userData) {
        throw new Error("Invalid authentication response");
      }

      const parsedUserData = JSON.parse(
        decodeURIComponent(userData)
      ) as UserData;

      await saveTokens({
        accessToken,
        refreshToken,
      });
      await saveUserData(parsedUserData);

      return {
        accessToken,
        refreshToken,
        userData: parsedUserData,
        isNewUser,
      };
    } else {
      throw new Error("Authentication was cancelled or failed");
    }
  } catch (error) {
    console.error("OAuth flow error:", error);
    throw error;
  }
}

export async function refreshAccessToken(): Promise<string> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    if (!data.accessToken) {
      throw new Error("Invalid refresh response");
    }

    await saveAccessToken(data.accessToken);

    return data.accessToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
}

export async function clearAuthData(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_DATA_KEY);
  } catch (error) {
    console.error("Error clearing auth data:", error);
    throw error;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const accessToken = await getAccessToken();
    return !!accessToken;
  } catch (error) {
    return false;
  }
}

export async function getUserData(): Promise<UserData | null> {
  try {
    const userData = await SecureStore.getItemAsync(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
}

export async function saveUserData(userData: UserData): Promise<void> {
  await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

async function saveTokens(tokens: AuthTokens): Promise<void> {
  await saveAccessToken(tokens.accessToken);
  await saveRefreshToken(tokens.refreshToken);
}

async function saveAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

async function saveRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}
