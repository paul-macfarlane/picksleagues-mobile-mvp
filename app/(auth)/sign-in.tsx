import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "~/lib/stores/auth";
import { Button } from "~/components/ui/button";

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInWithDiscord } = useAuthStore();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    router.replace("/");
  };

  const handleDiscordSignIn = async () => {
    await signInWithDiscord();
    router.replace("/");
  };

  return (
    <View
      className={
        "flex-1 flex flex-col justify-center items-center p-4 bg-background dark:bg-background"
      }
    >
      <View className="w-full max-w-sm flex flex-col gap-8">
        <View className="flex flex-col items-center gap-2">
          <Text className="text-2xl font-bold tracking-tight text-foreground">
            Welcome to Picks Leagues
          </Text>
          <Text className="text-sm text-muted-foreground">
            Sign in to start competing with friends
          </Text>
        </View>

        <View className="flex flex-col gap-4">
          <Button
            onPress={handleGoogleSignIn}
            className="w-full bg-[#4285F4] dark:bg-[#3B3F4E]"
          >
            <Text className="text-white">Continue with Google</Text>
          </Button>

          <Button
            onPress={handleDiscordSignIn}
            className="w-full bg-[#5865F2] dark:bg-[#5865F2]"
          >
            <Text className="text-white">Continue with Discord</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
