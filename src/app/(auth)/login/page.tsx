"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError, getOnboardingStatus, loginWithPassword, setOnboardingComplete } from "@/lib/api/client";
import { emitToast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithPassword(username.trim(), password);
      const status = await getOnboardingStatus();
      setOnboardingComplete(status.onboarding_complete);
      emitToast({ type: "success", title: "Logged in successfully." });
      router.replace(status.onboarding_complete ? "/dashboard" : "/onboarding");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Invalid username or password.");
        emitToast({ type: "error", title: "Login failed.", description: "Invalid username or password." });
      } else {
        setError("Unable to sign in right now. Please try again.");
        emitToast({ type: "error", title: "Login failed.", description: "Please try again in a moment." });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Login Page</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-slate-900 underline underline-offset-2 hover:text-slate-700">
              Register
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
