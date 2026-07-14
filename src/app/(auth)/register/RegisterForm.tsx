"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, registerWithPassword } from "@/lib/api/client";
import { emitToast } from "@/lib/toast";
import { AlertCircle, Eye, EyeOff, FileSearch } from "lucide-react";

interface FieldErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

function validateForm(username: string, email: string, password: string, confirmPassword: string): FieldErrors {
  const errs: FieldErrors = {};

  if (!username) {
    errs.username = "Username is required.";
  } else if (/\s/.test(username)) {
    errs.username = "Username cannot contain spaces.";
  } else if (username.length < 3) {
    errs.username = "Username must be at least 3 characters.";
  } else if (!USERNAME_REGEX.test(username)) {
    errs.username = "Only letters, numbers, underscores, dots, and hyphens are allowed.";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errs.email = "Enter a valid email address.";
  }

  if (!password) {
    errs.password = "Password is required.";
  } else if (password.length < 8) {
    errs.password = "Password must be at least 8 characters.";
  } else if (/^\d+$/.test(password)) {
    errs.password = "Password cannot be entirely numeric.";
  }

  if (!confirmPassword) {
    errs.confirmPassword = "Please confirm your password.";
  } else if (password && confirmPassword !== password) {
    errs.confirmPassword = "Passwords do not match.";
  }

  return errs;
}

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errs = validateForm(username, email, password, confirmPassword);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await registerWithPassword(username, email.trim(), password);
      emitToast({ type: "success", title: "Account created.", description: "Complete onboarding to unlock dashboard." });
      router.replace("/onboarding");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        // Parse field-level errors returned by the API
        const data = err.data as Record<string, string | string[]> | null;
        if (data && typeof data === "object") {
          const apiErrors: FieldErrors = {};
          if (data.username) apiErrors.username = Array.isArray(data.username) ? data.username[0] : data.username;
          if (data.email) apiErrors.email = Array.isArray(data.email) ? data.email[0] : data.email;
          if (data.password) apiErrors.password = Array.isArray(data.password) ? data.password[0] : data.password;
          if (Object.keys(apiErrors).length > 0) {
            setFieldErrors(apiErrors);
            return;
          }
        }
        setFieldErrors({ username: "Username or email may already be taken." });
      } else {
        emitToast({ type: "error", title: "Registration failed.", description: "Unable to create account right now. Please try again." });
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
          <span className="text-lg font-semibold text-white">TenderKhoj</span>
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
        <p className="text-xs text-ink-600">&copy; 2026 TenderKhoj. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-600">
              <FileSearch className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-ink-900">TenderKhoj</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-ink-900">Create your account</h1>
            <p className="mt-1 text-sm text-ink-500">Start discovering tenders matched to your firm.</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit} noValidate>
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Username <span className="text-danger-500">*</span>
              </label>
              <Input
                id="username"
                placeholder="your_username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); clearFieldError("username"); }}
                autoComplete="username"
                aria-invalid={!!fieldErrors.username}
              />
              {fieldErrors.username && (
                <p className="flex items-center gap-1 text-xs text-danger-600">
                  <AlertCircle className="h-3 w-3 shrink-0" aria-hidden />
                  {fieldErrors.username}
                </p>
              )}
              <p className="text-xs text-ink-400">Letters, numbers, underscores, dots, hyphens. No spaces.</p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Email <span className="text-ink-400 font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <Input
                id="email"
                placeholder="you@company.com"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                autoComplete="email"
                aria-invalid={!!fieldErrors.email}
              />
              {fieldErrors.email && (
                <p className="flex items-center gap-1 text-xs text-danger-600">
                  <AlertCircle className="h-3 w-3 shrink-0" aria-hidden />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Password <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); clearFieldError("confirmPassword"); }}
                  autoComplete="new-password"
                  aria-invalid={!!fieldErrors.password}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-ink-400 hover:text-ink-600"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="flex items-center gap-1 text-xs text-danger-600">
                  <AlertCircle className="h-3 w-3 shrink-0" aria-hidden />
                  {fieldErrors.password}
                </p>
              ) : (
                <p className="text-xs text-ink-400">At least 8 characters. Cannot be entirely numeric.</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wide text-ink-500">
                Confirm password <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }}
                  autoComplete="new-password"
                  aria-invalid={!!fieldErrors.confirmPassword}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-ink-400 hover:text-ink-600"
                  tabIndex={-1}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="flex items-center gap-1 text-xs text-danger-600">
                  <AlertCircle className="h-3 w-3 shrink-0" aria-hidden />
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button className="mt-2 w-full" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-navy-600 underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>

          <div className="mt-6 flex justify-center gap-4 text-xs text-ink-400">
            <Link href="/terms" className="hover:text-ink-600 transition-colors">Terms</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-ink-600 transition-colors">Privacy</Link>
            <span>·</span>
            <Link href="/disclaimer" className="hover:text-ink-600 transition-colors">Legal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
