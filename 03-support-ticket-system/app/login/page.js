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
} from "../components/Icons";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Provide a clear, actionable message for the most common login failure
        if (
          error.message.toLowerCase().includes("invalid login credentials") ||
          error.message.toLowerCase().includes("invalid email or password")
        ) {
          setErrorMessage(
            "INVALID_CREDENTIALS"
          );
        } else if (error.message.toLowerCase().includes("email not confirmed")) {
          setErrorMessage("EMAIL_NOT_CONFIRMED");
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      // Successful login
      router.push("/dashboard");
    } catch (err) {
      setErrorMessage("An unexpected error occurred. Please try again.");
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
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Sign in to manage your support tickets and replies
              </p>
            </div>

            {/* Invalid credentials: most common error */}
            {errorMessage === "INVALID_CREDENTIALS" && (
              <div className="mb-6 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-400">
                <div className="flex items-start gap-3">
                  <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-800 dark:text-red-300">Incorrect email or password</p>
                    <p className="mt-1 text-xs leading-relaxed text-red-700 dark:text-red-400">
                      This could also mean your account email is not yet confirmed.
                      Check your inbox for a confirmation email and click the link before signing in.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href="/signup"
                        className="rounded-lg bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800 px-3 py-1 text-[11px] font-semibold text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/60 transition"
                      >
                        Create a new account
                      </Link>
                      <span className="self-center text-[11px] text-red-500">or check your email for the confirmation link</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email not confirmed error */}
            {errorMessage === "EMAIL_NOT_CONFIRMED" && (
              <div className="mb-6 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/40 p-4 text-sm">
                <div className="flex items-start gap-3">
                  <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-300">Email address not yet confirmed</p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-700 dark:text-amber-400">
                      Open your inbox and click the confirmation link from Supabase/ResolveHQ. After confirming, return here and sign in.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Other errors */}
            {errorMessage && errorMessage !== "INVALID_CREDENTIALS" && errorMessage !== "EMAIL_NOT_CONFIRMED" && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/40 p-3.5 text-sm text-red-700 dark:text-red-400">
                <AlertCircleIcon className="h-5 w-5 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
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
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Footer Navigation */}
            <div className="mt-8 text-center border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition ml-1"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}