import { View } from "react-native";
import { useRouter } from "expo-router";
import { SignInFunction, useAuthStore } from "~/lib/stores/auth";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";

export default function SignInScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInWithDiscord, isSigningIn, signInError } =
    useAuthStore();

  const handleSignIn = async (signInMethod: SignInFunction) => {
    const { error, isNewUser } = await signInMethod();
    if (error) {
      // error is rendered below in button
      return;
    }

    router.replace(isNewUser ? "/(app)/setup-profile" : "/(app)/home");
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
              className="w-full bg-[#4285F4]"
              disabled={isSigningIn}
            >
              <Text className="text-white">Continue with Google</Text>
            </Button>

            <Button
              onPress={() => handleSignIn(signInWithDiscord)}
              className="w-full bg-[#5865F2]"
              disabled={isSigningIn}
            >
              <Text className="text-white">Continue with Discord</Text>
            </Button>

            {signInError && (
              <Text className="text-sm text-destructive-foreground">
                {signInError}
              </Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
