"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Eye, EyeOff, FileSearch, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError, confirmPasswordReset } from "@/lib/api/client";
import { emitToast } from "@/lib/toast";

function firstError(data: unknown, field: string): string | null {
  if (!data || typeof data !== "object") return null;
  const value = (data as Record<string, unknown>)[field];
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  if (typeof value === "string") return value;
  return null;
}

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid") ?? "";
  const token = searchParams.get("token") ?? "";

  const linkMissing = useMemo(() => !uid || !token, [uid, token]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset({
        uid,
        token,
        password,
        password_confirm: confirmPassword,
      });
      emitToast({
        type: "success",
        title: "Password updated",
        description: "You can sign in with your new password.",
      });
      router.replace("/login");
    } catch (err) {
      let message = "Unable to reset password. Please try again.";
      if (err instanceof ApiError) {
        message =
          firstError(err.data, "password") ||
          firstError(err.data, "password_confirm") ||
          firstError(err.data, "detail") ||
          err.message;
      }
      setError(message);
      emitToast({ type: "error", title: "Reset failed.", description: message });
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
            Choose a new password.
          </p>
          <p className="text-sm text-ink-400">
            After resetting, you&apos;ll be signed out of other sessions for security.
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

          {linkMissing ? (
            <div className="rounded-xl border border-danger-200 bg-danger-50 p-6 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-danger-600" />
              <h1 className="mt-3 text-xl font-bold text-ink-900">Invalid reset link</h1>
              <p className="mt-2 text-sm text-ink-600">
                This password reset link is missing or incomplete. Request a new one from the
                forgot password page.
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 inline-flex text-sm font-semibold text-navy-600 hover:underline"
              >
                Request a new link
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-ink-900">Set new password</h1>
                <p className="mt-1 text-sm text-ink-500">
                  Enter a new password for your TenderKhoj account.
                </p>
              </div>

              <form className="space-y-4" onSubmit={onSubmit} noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                    New password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirm" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Confirm password
                  </label>
                  <Input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
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
                  {isSubmitting ? "Updating…" : "Update password"}
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

export function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-ink-50 text-sm text-ink-500">
          Loading…
        </div>
      }
    >
      <ResetPasswordFormInner />
    </Suspense>
  );
}
