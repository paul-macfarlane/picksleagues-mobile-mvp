import { View, Text } from "react-native";
import { useAuthStore } from "~/lib/stores/auth";
import { Button } from "~/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { signOut } = useAuthStore();

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 flex flex-col justify-center items-center p-4 gap-4">
        <Text className="text-xl font-semibold text-primary">
          Welcome to Picks Leagues!
        </Text>
        <Button onPress={signOut}>
          <Text className="text-primary-foreground">Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
