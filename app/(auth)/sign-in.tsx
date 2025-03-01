// todo replace Text with Text from ~/components/ui
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "~/lib/stores/auth";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInWithDiscord, isNewUser } = useAuthStore();

  const handleSignIn = async (signInMethod: () => Promise<void>) => {
    await signInMethod();
    // todo has compile error right now but might just need to run the app
    router.replace(isNewUser ? "/(auth)/setup-profile" : "/");
  };

  return (
    <SafeAreaView className="flex-1">
      <View className={cn("flex-1 justify-center items-center p-4")}>
        <View className="w-full max-w-sm flex flex-col gap-8">
          <View className="flex flex-col gap-2 text-center">
            <Text className="text-2xl font-bold tracking-tight text-foreground">
              Welcome to Picks Leagues
            </Text>
            <Text className="text-sm text-muted-foreground">
              Sign in to start competing with friends
            </Text>
          </View>

          <View className="flex flex-col gap-4">
            <Button
              onPress={() => handleSignIn(signInWithGoogle)}
              className="w-full bg-[#4285F4] dark:bg-[#3B3F4E]"
            >
              <Text className="text-white">Continue with Google</Text>
            </Button>

            <Button
              onPress={() => handleSignIn(signInWithDiscord)}
              className="w-full bg-[#5865F2] dark:bg-[#5865F2]"
            >
              <Text className="text-white">Continue with Discord</Text>
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
