import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Link } from "expo-router";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 flex flex-col justify-center items-center p-4 gap-4">
        <Text className="text-xl font-semibold text-foreground">
          This screen doesn't exist.
        </Text>
        <Link href="/(app)/home" asChild>
          <Button>
            <Text className="text-primary-foreground">Go to home screen</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
