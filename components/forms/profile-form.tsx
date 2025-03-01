import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  CheckUsernameAvailabilityFunction,
  Profile,
} from "~/lib/stores/profile";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";

type ProfileFormProps = {
  initialValues: Partial<Profile>;
  onSubmit: (profile: Profile) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitLabel: string;
  checkUsernameAvailable: CheckUsernameAvailabilityFunction;
};

export function ProfileForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  submitError,
  checkUsernameAvailable,
}: ProfileFormProps) {
  const [values, setValues] = React.useState<Profile>({
    username: "",
    firstName: "",
    lastName: "",
    profilePicUrl: "",
    ...initialValues,
  });
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof Profile, string>>
  >({});
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);

  // todo will be replaced by zod schema validation
  const validateUsername = async (username: string) => {
    if (username === initialValues.username) return true;
    if (username.length < 8) return "Username must be at least 8 characters";
    if (username.length > 20) return "Username must be at most 20 characters";
    if (!/^[a-zA-Z0-9_-]+$/.test(username))
      return "Username can only contain letters, numbers, underscores, and hyphens";

    setIsCheckingUsername(true);
    const isAvailable = await checkUsernameAvailable(username);
    setIsCheckingUsername(false);
    return isAvailable ? true : "Username is already taken";
  };

  // todo update validation to use zod instead
  const handleSubmit = async () => {
    const newErrors: typeof errors = {};

    // Validate required fields
    if (!values.username) newErrors.username = "Username is required";
    if (!values.firstName) newErrors.firstName = "First name is required";
    if (!values.lastName) newErrors.lastName = "Last name is required";

    // Validate username format
    if (values.username) {
      const usernameValidation = await validateUsername(values.username);
      if (typeof usernameValidation === "string") {
        newErrors.username = usernameValidation;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await onSubmit(values);
    }
  };

  const handleChange = (field: keyof Profile) => (text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <View className="flex flex-col gap-4 w-full">
      <View className="flex flex-col gap-1.5">
        <Text className="text-sm font-medium text-foreground">Username *</Text>
        <Input
          value={values.username}
          onChangeText={handleChange("username")}
          placeholder="Enter username (8-20 characters)"
          className={cn(
            errors.username ? "border-destructive" : "focus:border-primary"
          )}
        />
        {errors.username && (
          <Text className="text-sm text-destructive">{errors.username}</Text>
        )}
        {isCheckingUsername && (
          <Text className="text-sm text-muted-foreground">
            Checking username availability...
          </Text>
        )}
      </View>

      <View className="flex flex-col gap-1.5">
        <Text className="text-sm font-medium text-foreground">
          First Name *
        </Text>
        <Input
          value={values.firstName}
          onChangeText={handleChange("firstName")}
          placeholder="Enter first name"
          className={cn(
            errors.firstName ? "border-destructive" : "focus:border-primary"
          )}
        />
        {errors.firstName && (
          <Text className="text-sm text-destructive">{errors.firstName}</Text>
        )}
      </View>

      <View className="flex flex-col gap-1.5">
        <Text className="text-sm font-medium text-foreground">Last Name *</Text>
        <Input
          value={values.lastName}
          onChangeText={handleChange("lastName")}
          placeholder="Enter last name"
          className={cn(
            errors.lastName ? "border-destructive" : "focus:border-primary"
          )}
        />
        {errors.lastName && (
          <Text className="text-sm text-destructive">{errors.lastName}</Text>
        )}
      </View>

      {/* TODO need to preview image when entered */}
      <View className="flex flex-col gap-1.5">
        <Text className="text-sm font-medium text-foreground">
          Profile Picture URL (Optional)
        </Text>
        <Input
          value={values.profilePicUrl}
          onChangeText={handleChange("profilePicUrl")}
          placeholder="Enter profile picture URL"
        />
      </View>

      <Button
        onPress={handleSubmit}
        disabled={isSubmitting || isCheckingUsername}
        className="w-full"
      >
        <Text className="text-primary-foreground">
          {isSubmitting ? "Saving..." : submitLabel}
        </Text>
      </Button>

      {submitError && (
        <Text className="text-sm text-destructive">{submitError}</Text>
      )}
    </View>
  );
}
