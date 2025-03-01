import { View } from "react-native";
import { ProfileForm } from "~/components/forms/profile-form";
import { Profile, useProfileStore } from "~/lib/stores/profile";
import { useEffect } from "react";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";

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
      // todo error is handling within form, decide if that is what is desired
      console.error(`error updating profile: ${error}`);
      return;
    }

    // todo toast success
    console.log("updated profile successfully", updatedProfile);
  };

  // todo add loading state using ~/components/ui/skeleton
  if (isFetching) return null;

  // todo add error state handling
  if (fetchError || !profile) return null;

  // todo this top setup could be replaced by a single page between this profile and setup profile
  // only difference is that this one also checks if the user is new and replaces route instead of pushing
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background p-4">
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
      </View>
    </SafeAreaView>
  );
}
