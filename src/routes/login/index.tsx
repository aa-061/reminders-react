import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/login/")({
  component: LoginPage,
});

function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const navigate = useNavigate();

  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  console.log("session = ", session);
  // if (session) {
  //   navigate({ to: "/" });
  //   return null;
  // }

  async function handleSignIn(email: string, password: string) {
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

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    handleSignIn(username, pass);
  }

  return (
    <div>
      <h1>Login</h1>
      <br />
      <form method="POST" onSubmit={handleSubmit}>
        <div>
          <label>
            <p>Username</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>
        <br />
        <div>
          <label>
            <p>Password</p>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </label>
        </div>
        <br />
        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
