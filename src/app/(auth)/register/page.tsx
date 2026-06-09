"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, registerWithPassword } from "@/lib/api/client";
import { emitToast } from "@/lib/toast";
import { AlertCircle, FileSearch } from "lucide-react";

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
        setError("Please check your details. Username or email may already be taken.");
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
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Get started in minutes</h2>
            <ul className="space-y-3">
              {[
                "Complete firm onboarding — PAN, GSTIN, and location",
                "Get AI-matched tenders for your scope of work",
                "Shortlist, track deadlines, and prepare bids — all in one place",
              ].map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy-600 text-xs font-bold text-white">
                    ✓
                  </span>
                  <span className="text-sm text-ink-300">{step}</span>
                </li>
              ))}
            </ul>
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
            <h1 className="text-2xl font-bold text-ink-900">Create your account</h1>
            <p className="mt-1 text-sm text-ink-500">Start discovering tenders matched to your firm.</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Username <span className="text-danger-500">*</span>
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
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Email <span className="text-ink-400 font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <Input
                id="email"
                placeholder="you@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Password <span className="text-danger-500">*</span>
              </label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger-600" aria-hidden />
                <p className="text-sm text-danger-700">{error}</p>
              </div>
            )}

            <Button className="mt-2 w-full" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-navy-600 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
