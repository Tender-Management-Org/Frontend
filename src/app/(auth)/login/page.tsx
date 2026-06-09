"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError, getOnboardingStatus, loginWithPassword, setOnboardingComplete } from "@/lib/api/client";
import { emitToast } from "@/lib/toast";
import { FileSearch, Lock } from "lucide-react";
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
    <div className="flex min-h-screen bg-ink-50">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[45%] lg:flex-col lg:justify-between bg-ink-900 p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-600">
            <FileSearch className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">TenderPilot</span>
        </div>
        <div className="space-y-6">
          <blockquote className="space-y-3">
            <p className="text-2xl font-semibold leading-snug text-white">
              Win more government tenders with AI-powered discovery and bid management.
            </p>
            <p className="text-sm text-ink-400">
              Built for Indian construction and infrastructure firms.
            </p>
          </blockquote>
          <div className="flex flex-wrap gap-3">
            {["eProcurement", "GeM Portal", "Smart Filtering", "Bid Workspace"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-ink-700 px-3 py-1 text-xs font-medium text-ink-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink-600">&copy; 2026 TenderPilot. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
              <FileSearch className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-ink-900">TenderPilot</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-ink-900">Welcome back</h1>
            <p className="mt-1 text-sm text-ink-500">Sign in to your account to continue.</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Username
              </label>
              <Input
                id="username"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Password
              </label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2.5">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-danger-600" aria-hidden />
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            )}

            <Button className="mt-2 w-full" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-navy-600 underline-offset-4 hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
