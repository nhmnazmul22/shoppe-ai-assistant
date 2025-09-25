"use client";

import { useState, useMemo } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, User, Lock, Loader2 } from "lucide-react";

export default function ShopeePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const emailError = useMemo(() => {
    if (!email) return "";
    // simple email check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? ""
      : "Invalid email format";
  }, [email]);

  const canSubmit = email && password && !emailError && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials");
      } else {
        const session = await getSession();
        if (session?.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/chat");
        }
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (type: "admin" | "agent") => {
    if (type === "admin") {
      setEmail("admin@shopee.com");
      setPassword("admin123");
    } else {
      setEmail("agent@shopee.com");
      setPassword("agent123");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header / Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/shopee-logo-final.png"
              alt="SOP Assistant"
              width={144}
              height={144}
              className="h-24 sm:h-28 md:h-32 lg:h-36 w-auto rounded-2xl shadow-lg object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Return &amp; Refund Support
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to access the SOP management system
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div
                className={`mt-1 flex items-center gap-2 rounded-md border px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#EE4D2D] ${
                  emailError ? "border-red-300" : "border-gray-300"
                }`}
              >
                <User className="w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "email-error" : undefined}
                  className="w-full text-gray-600 outline-none placeholder-gray-400 text-sm"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
              {emailError && (
                <p id="email-error" className="mt-1 text-xs text-red-600">
                  {emailError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#EE4D2D]">
                <Lock className="w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-gray-600 outline-none placeholder-gray-400 text-sm"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[#EE4D2D] hover:bg-[#d63916] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE4D2D] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo helper */}
          <div className="mt-6 text-center text-sm text-gray-600 space-y-1">
            <p>Demo Accounts:</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => quickFill("admin")}
                className="px-3 py-1.5 rounded bg-orange-50 text-[#EE4D2D] hover:bg-orange-100 border border-orange-200"
                type="button"
              >
                Use Admin
              </button>
              <button
                onClick={() => quickFill("agent")}
                className="px-3 py-1.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                type="button"
              >
                Use Agent
              </button>
            </div>
            <p>Admin: admin@shopee.com / admin123</p>
            <p>Agent: agent@shopee.com / agent123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
