"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileSearch, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError, requestPasswordReset } from "@/lib/api/client";
import { emitToast } from "@/lib/toast";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
      emitToast({
        type: "success",
        title: "Check your email",
        description: "If an account exists for that address, we sent reset instructions.",
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to send reset email. Please try again.";
      setError(message);
      emitToast({ type: "error", title: "Request failed.", description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <div className="hidden lg:flex lg:w-[45%] lg:flex-col lg:justify-between bg-ink-900 p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-600">
            <FileSearch className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">TenderKhoj</span>
        </div>
        <div className="space-y-3">
          <p className="text-2xl font-semibold leading-snug text-white">
            Reset your password securely.
          </p>
          <p className="text-sm text-ink-400">
            We&apos;ll email you a one-time link if an account exists for that address.
          </p>
        </div>
        <p className="text-xs text-ink-600">&copy; 2026 TenderKhoj. All rights reserved.</p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
              <FileSearch className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-ink-900">TenderKhoj</span>
          </div>

          {sent ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />
              <h1 className="mt-3 text-xl font-bold text-ink-900">Check your email</h1>
              <p className="mt-2 text-sm text-ink-600">
                If an account exists for <strong>{email.trim()}</strong>, we sent password reset
                instructions. The link expires after a short time.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-600 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-ink-900">Forgot password?</h1>
                <p className="mt-1 text-sm text-ink-500">
                  Enter the email on your account and we&apos;ll send a reset link.
                </p>
              </div>

              <form className="space-y-4" onSubmit={onSubmit} noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2.5">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-danger-600" aria-hidden />
                    <p className="text-sm text-danger-700">{error}</p>
                  </div>
                )}

                <Button className="mt-2 w-full" size="lg" type="submit" disabled={isSubmitting || !email.trim()}>
                  {isSubmitting ? "Sending…" : "Send reset link"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-500">
                <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-navy-600 hover:underline">
                  <ArrowLeft className="h-4 w-4" />
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
