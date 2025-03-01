import { View } from "react-native";
import { ProfileForm } from "~/components/forms/profile-form";
import { Profile, useProfileStore } from "~/lib/stores/profile";
import { useEffect } from "react";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { ProfileFormSkeleton } from "~/components/forms/profile-form-skeleton";

export default function ProfileScreen() {
  const {
    profile,
    isFetching,
    fetchError,
    fetchProfile,
    isUpdating,
    updateError,
    updateProfile,
    checkUsernameAvailable,
  } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (updatedProfile: Profile) => {
    const { error } = await updateProfile(updatedProfile);
    if (error) {
      // error is rendered within form
      return;
    }

    Toast.show({
      type: "success",
      text1: "Profile updated successfully",
    });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background p-4">
        {isFetching ? (
          <View className="max-w-sm mx-auto w-full">
            <ProfileFormSkeleton />
          </View>
        ) : fetchError || !profile ? (
          <Text className="text-destructive text-lg text-center">
            Failed to fetch profile. Please try again later.
          </Text>
        ) : (
          <View className="max-w-sm mx-auto w-full flex flex-col gap-6">
            <View className="flex flex-col gap-2">
              <Text className="text-2xl font-bold text-foreground">
                Edit Profile
              </Text>
              <Text className="text-sm text-muted-foreground">
                Update your profile information
              </Text>
            </View>

            <ProfileForm
              initialValues={profile}
              onSubmit={handleSubmit}
              submitError={updateError}
              isSubmitting={isUpdating}
              submitLabel="Save Changes"
              checkUsernameAvailable={checkUsernameAvailable}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
