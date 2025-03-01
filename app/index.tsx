import { useAuthStore } from "~/lib/stores/auth";
import { Redirect } from "expo-router";
export default function IndexRedirect() {
  const { isAuthenticated } = useAuthStore();
  const route = isAuthenticated ? "/(app)/home" : "/(auth)/sign-in";

  return <Redirect href={route} />;
}
