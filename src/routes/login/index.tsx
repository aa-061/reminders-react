import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { signIn, useSession } from "@/lib/auth-client";
import { z } from "zod";
import "./Login.css";

type LoginSearch = {
  redirect?: string;
};

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const Route = createFileRoute("/login/")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: (search.redirect as string) || undefined,
    };
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (session) {
      navigate({ to: redirect || "/" });
    }
  }, [session, navigate, redirect]);

  if (isPending) {
    return (
      <div className="LoginPage__loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (session) {
    return null;
  }

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setEmailError("");

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      if (errors.email) {
        setEmailError(errors.email[0]);
      }
      if (errors.password) {
        setError(errors.password[0]);
      }
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message || "Sign in failed. Please try again.");
        setIsLoading(false);
        return;
      }

      navigate({ to: redirect || "/" });
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="LoginPage__container">
      <div className="LoginPage__card">
        <h1>Login</h1>
        <p className="LoginPage__subtitle">Sign in to access your reminders</p>

        {error && <div className="LoginPage__error-message">{error}</div>}

        <form onSubmit={handleSignIn} className="LoginPage__form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setError("");
              }}
              className={emailError ? "LoginPage__input-error" : ""}
              placeholder="you@example.com"
              disabled={isLoading}
              autoComplete="email"
            />
            {emailError && <span className="LoginPage__field-error">{emailError}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <button className="LoginPage__btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
