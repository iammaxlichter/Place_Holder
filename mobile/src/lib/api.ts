// src/lib/api.ts
import { Platform } from "react-native";

// Dev base URL: adjust per platform if needed
const DEV_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000" // Android emulator -> host
    : "http://localhost:3000"; // Web / iOS simulator

const BASE_URL = DEV_BASE_URL;

export type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
}

export async function createUser(input: { email: string; name?: string }) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`Failed to create user: ${res.status}`);
  return res.json() as Promise<User>;
}
