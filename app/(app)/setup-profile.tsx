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
    isFetching,
    fetchError,
    profile,
    fetchProfile,
    updateProfile,
    checkUsernameAvailable,
    isUpdating,
    updateError,
  } = useProfileStore();
  const { isNewUser } = useAuthStore();

  useEffect(() => {
    if (!isNewUser) {
      router.replace("/(app)/home");
    }
    fetchProfile();
  }, [isNewUser]);

  const handleSubmit = async (updatedProfile: Profile) => {
    const { error } = await updateProfile(updatedProfile);
    if (error) {
      // error is rendered within form
      return;
    }

    router.replace("/(app)/home");
  };

  // todo add loading state using ~/components/ui/skeleton
  if (isFetching) return null;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background p-4">
        {fetchError || !profile ? (
          <Text className="text-destructive text-lg text-center">
            Failed to fetch profile. Please try again later.
          </Text>
        ) : (
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
              submitLabel="Complete Setup"
              isSubmitting={isUpdating}
              submitError={updateError}
              checkUsernameAvailable={checkUsernameAvailable}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
