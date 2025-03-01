import { View } from "react-native";
import { useRouter } from "expo-router";
import { ProfileForm } from "~/components/forms/profile-form";
import { Profile, useProfileStore } from "~/lib/stores/profile";
import { useAuthStore } from "~/lib/stores/auth";
import { useEffect } from "react";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SetupProfileScreen() {
  const router = useRouter();
  const {
    profile,
    isLoading,
    fetchProfile,
    updateProfile,
    checkUsernameAvailable,
  } = useProfileStore();
  const { isNewUser } = useAuthStore();

  useEffect(() => {
    if (!isNewUser) {
      router.replace("/");
    }
    fetchProfile();
  }, [isNewUser]);

  const handleSubmit = async (updatedProfile: Profile) => {
    await updateProfile(updatedProfile);
    // this is not routing the user to home page for some reason
    router.replace("/");
  };

  if (!profile) return null;

  // todo this top setup could be replaced by a single page between this setup-profile and profile
  // only difference is that this one also checks if the user is new and replaces route instead of pushing
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background p-4">
        <View className="max-w-sm mx-auto w-full flex flex-col gap-6">
          <View className="flex flex-col gap-2">
            <Text className="text-2xl font-bold text-foreground">
              Complete Your Profile
            </Text>
            <Text className="text-sm text-muted-foreground">
              Set up your profile to start competing with friends
            </Text>
          </View>

          <ProfileForm
            initialValues={profile}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Complete Setup"
            checkUsernameAvailable={checkUsernameAvailable}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
