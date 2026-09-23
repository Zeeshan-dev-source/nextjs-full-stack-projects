"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "../components/Navbar";
import {
  TicketIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowPathIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "../components/Icons";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // data.session is only set when email confirmation is DISABLED (auto-confirm ON)
      // data.user without session = email confirmation is REQUIRED before login works
      if (data?.session) {
        // Auto-confirm is enabled — user is logged in immediately
        setSuccessMessage("SESSION_READY");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else if (data?.user && !data?.session) {
        // Email confirmation required — set a special state so UI shows the banner
        setSuccessMessage("EMAIL_CONFIRM_REQUIRED");
      } else {
        setSuccessMessage("GENERIC_SUCCESS");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-all">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/25 mb-4">
                <TicketIcon className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Create an account
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Register a new customer account to open and manage tickets
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/40 p-3.5 text-sm text-red-700 dark:text-red-400">
                <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Email Confirmation Required Banner */}
            {successMessage === "EMAIL_CONFIRM_REQUIRED" && (
              <div className="mb-6 flex flex-col gap-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 p-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <CheckCircleIcon className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-indigo-900 dark:text-indigo-200">
                    Account created — check your email!
                  </span>
                </div>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                  A confirmation link has been sent to <strong>{email}</strong>. You must click that link before you can sign in.
                </p>
                <ol className="list-decimal list-inside space-y-1 text-xs text-indigo-700 dark:text-indigo-300 pl-1">
                  <li>Open your email inbox for <strong>{email}</strong></li>
                  <li>Click the <strong>&quot;Confirm your email&quot;</strong> link from ResolveHQ / Supabase</li>
                  <li>Return here and sign in with your credentials</li>
                </ol>
                <div className="mt-1 flex items-center gap-3">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-sm"
                  >
                    Go to Login
                  </Link>
                  <span className="text-[11px] text-indigo-500 dark:text-indigo-400">
                    (after confirming your email)
                  </span>
                </div>
              </div>
            )}

            {/* Auto-confirm / session ready */}
            {successMessage === "SESSION_READY" && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
                <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                  Account created! Redirecting to your dashboard...
                </span>
              </div>
            )}

            {/* Generic success */}
            {successMessage === "GENERIC_SUCCESS" && (
              <div className="mb-6 flex flex-col gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
                <div className="flex items-center gap-2.5">
                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Account created successfully!</span>
                </div>
                <Link href="/login" className="self-start rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition shadow-sm">
                  Go to Login
                </Link>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Password
                  </label>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Min. 6 chars
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 px-4 py-3 pr-11 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition focus:outline-none"
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-500/35 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Footer Navigation */}
            <div className="mt-8 text-center border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition ml-1"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}