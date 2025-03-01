import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "~/lib/stores/auth";

export default function AppLayout() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
