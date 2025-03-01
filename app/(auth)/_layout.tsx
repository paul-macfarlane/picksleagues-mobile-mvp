import { Redirect } from "expo-router";
import { useAuthStore } from "~/lib/stores/auth";
import { Stack } from "expo-router";

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
