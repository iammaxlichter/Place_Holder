// src/screens/HomeScreen.tsx
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { useExampleStore } from "../store/useExampleStore";
import { useUsers, useCreateUser } from "../lib/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1).optional(),
});

type UserForm = z.infer<typeof userSchema>;

export default function HomeScreen() {
  const count = useExampleStore((s) => s.count);
  const increment = useExampleStore((s) => s.increment);

  const { data, isLoading, error } = useUsers();
  const createUser = useCreateUser();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { email: "", name: "" },
  });

  const onSubmit = (values: UserForm) => {
    createUser.mutate(values, {
      onSuccess: () => reset(),
    });
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-900 px-4 pt-10">
      <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        Home
      </Text>

      <Text className="text-slate-500 dark:text-slate-300">
        Full-stack app online 👋{"\n"}
        Expo + React Query + Zustand + NativeWind + Nest + Prisma
      </Text>

      <Pressable
        onPress={increment}
        className="mt-4 self-start rounded-xl bg-slate-900 px-4 py-2 dark:bg-slate-100"
      >
        <Text className="text-white dark:text-slate-900 font-semibold">
          Count: {count}
        </Text>
      </Pressable>

      {/* Create user form */}
      <View className="mt-8 w-full gap-2">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Create user
        </Text>

        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          className="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
          onChangeText={(text) => setValue("email", text, { shouldValidate: true })}
        />
        {errors.email && (
          <Text className="text-red-500 text-sm">{errors.email.message}</Text>
        )}

        <TextInput
          placeholder="Name (optional)"
          className="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
          onChangeText={(text) => setValue("name", text, { shouldValidate: true })}
        />
        {errors.name && (
          <Text className="text-red-500 text-sm">{errors.name.message}</Text>
        )}

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={createUser.isPending}
          className="mt-2 self-start rounded-xl bg-emerald-600 px-4 py-2 disabled:opacity-60"
        >
          <Text className="text-white font-semibold">
            {createUser.isPending ? "Saving..." : "Create"}
          </Text>
        </Pressable>

        {createUser.isError && (
          <Text className="text-red-500 text-sm mt-1">
            Failed to create user.
          </Text>
        )}
      </View>

      {/* Users list */}
      <View className="mt-8 w-full flex-1">
        <Text className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Users from API
        </Text>

        {isLoading && <ActivityIndicator />}

        {error && (
          <Text className="text-red-500">Failed to load users.</Text>
        )}

        {!isLoading && !error && (
          <FlatList
            data={data ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="py-1">
                <Text className="text-slate-800 dark:text-slate-100">
                  {item.email} {item.name ? `(${item.name})` : ""}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-slate-500 dark:text-slate-300">
                No users yet.
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
}
