import { signOut } from "@/lib/auth-client";

export async function handleSignOut() {
  await signOut();
  console.log("Signed out");
}
