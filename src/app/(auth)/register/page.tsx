 "use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, registerWithPassword } from "@/lib/api/client";
import { emitToast } from "@/lib/toast";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await registerWithPassword(username.trim(), email.trim(), password);
      emitToast({ type: "success", title: "Account created.", description: "Complete onboarding to unlock dashboard." });
      router.replace("/onboarding");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError("Please check entered details. Username/email may already exist.");
        emitToast({ type: "error", title: "Registration failed.", description: "Please check your details and try again." });
      } else {
        setError("Unable to create account right now. Please try again.");
        emitToast({ type: "error", title: "Registration failed.", description: "Please try again in a moment." });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
          <Input
            placeholder="Email (optional)"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Account"}
          </Button>
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-slate-900 underline underline-offset-2 hover:text-slate-700">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
