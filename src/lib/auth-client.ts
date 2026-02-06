import { createAuthClient } from "better-auth/react";

const url = import.meta.env.VITE_SERVER_URL;

if (!url)
  throw new Error(
    "No server URL has been provided. Make sure to set VITE_SERVER_URL env var.",
  );

export const authClient = createAuthClient({
  baseURL: url,
});

export const { signIn, signUp, signOut, useSession } = authClient;
