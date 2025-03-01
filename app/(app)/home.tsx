import { View, Text } from "react-native";
import { useAuthStore } from "~/lib/stores/auth";
import { Button } from "~/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { signOut, isSigningOut, signOutError } = useAuthStore();
  const router = useRouter();

  const onSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      // error is rendered below in button
      return;
    }

    router.replace("/(auth)/sign-in");
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex flex-col justify-center items-center p-4 gap-4">
        <Text className="text-xl font-semibold text-foreground">
          Welcome to Picks Leagues!
        </Text>
        <Button onPress={onSignOut} disabled={isSigningOut}>
          <Text className="text-primary-foreground">Sign Out</Text>
        </Button>

        {signOutError && (
          <Text className="text-sm text-destructive">{signOutError}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}
