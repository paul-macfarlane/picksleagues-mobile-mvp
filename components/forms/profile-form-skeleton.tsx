import { View } from "react-native";
import { Skeleton } from "~/components/ui/skeleton";

export function ProfileFormSkeleton() {
  return (
    <View className="flex flex-col gap-6 w-full">
      {/* Title and subtitle */}
      <View className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-64" />
      </View>

      {/* Form fields */}
      <View className="flex flex-col gap-4">
        {/* Username field */}
        <View className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </View>

        {/* First name field */}
        <View className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </View>

        {/* Last name field */}
        <View className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </View>

        {/* Profile pic URL field */}
        <View className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-full" />
        </View>

        {/* Submit button */}
        <Skeleton className="h-10 w-full mt-2" />
      </View>
    </View>
  );
}
