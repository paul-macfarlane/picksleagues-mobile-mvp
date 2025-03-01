import React from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Profile } from "~/lib/stores/profile";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { Input } from "~/components/ui/input";
import { z } from "zod";

const profileSchema = z.object({
  username: z
    .string()
    .min(8, "Username must be at least 8 characters")
    .max(20, "Username must be at most 20 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  profilePicUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type ProfileFormProps = {
  initialValues: Partial<Profile>;
  onSubmit: (profile: Profile) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitLabel: string;
};

export function ProfileForm({
  initialValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  submitError,
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

  const handleSubmit = async () => {
    const result = profileSchema.safeParse(values);

    if (!result.success) {
      const formattedErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof Profile;
        formattedErrors[path] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    await onSubmit(result.data);
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
          className={cn(
            errors.profilePicUrl ? "border-destructive" : "focus:border-primary"
          )}
        />
        {errors.profilePicUrl && (
          <Text className="text-sm text-destructive">
            {errors.profilePicUrl}
          </Text>
        )}
      </View>

      <Button onPress={handleSubmit} disabled={isSubmitting} className="w-full">
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
