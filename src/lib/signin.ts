import { signIn } from "@/lib/auth-client";

export async function handleSignIn(email: string, password: string) {
  const result = await signIn.email({
    email,
    password,
  });

  if (result.error) {
    console.error("Sign in failed:", result.error.message);
    return;
  }

  console.log("Signed in:", result.data.user);
}
