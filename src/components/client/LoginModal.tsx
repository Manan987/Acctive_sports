"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useCustomer } from "@/context/CustomerContext";
import { Icon } from "@/components/ui/Icon";

/**
 * Two-step OTP login modal:
 *   Step 1 — Enter phone number + name → sends OTP
 *   Step 2 — Enter 6-digit OTP → verifies and creates session
 *
 * In dev mode the OTP is shown on screen for easy testing.
 */

type Step = "phone" | "otp" | "done";

export function LoginModal() {
  const { showLogin, closeLogin, refresh } = useCustomer();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Reset when modal opens
  useEffect(() => {
    if (showLogin) {
      setStep("phone");
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setDevOtp("");
      setCountdown(0);
      setTimeout(() => phoneRef.current?.focus(), 100);
    }
  }, [showLogin]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Close on Escape
  useEffect(() => {
    if (!showLogin) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLogin();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showLogin, closeLogin]);

  const sendOtp = useCallback(async () => {
    if (!phone.trim() || !name.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/customer/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), name: name.trim(), email: email.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP.");
        return;
      }
      // In dev mode, show the OTP on screen
      if (data.otp) setDevOtp(data.otp);
      setStep("otp");
      setCountdown(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [phone, name, email]);

  const verifyOtp = useCallback(async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/customer/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Verification failed.");
        // Clear OTP inputs on wrong code
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => otpRefs.current[0]?.focus(), 50);
        return;
      }
      setStep("done");
      // Refresh the customer context with the new session
      await refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [phone, refresh]);

  // Handle OTP input
  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return; // digits only
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); // single digit
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all 6 digits entered
      const code = newOtp.join("");
      if (code.length === 6) {
        verifyOtp(code);
      }
    },
    [otp, verifyOtp]
  );

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  // Handle paste
  const handleOtpPaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (pasted.length === 6) {
        const newOtp = pasted.split("");
        setOtp(newOtp);
        verifyOtp(pasted);
      }
    },
    [verifyOtp]
  );

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
        onClick={closeLogin}
      />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-md rounded-t-3xl bg-white p-8 shadow-2xl sm:rounded-3xl dark:bg-ink-900"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        {/* Close button */}
        <button
          onClick={closeLogin}
          className="absolute right-4 top-4 rounded-xl p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800"
          aria-label="Close"
        >
          <Icon name="close" size={20} />
        </button>

        {/* ─── Step 1: Phone + Name ─── */}
        {step === "phone" && (
          <div>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-flame-500/10 text-flame-500">
                <Icon name="phone" size={28} />
              </div>
              <h2 className="text-xl font-bold text-ink-900 dark:text-white">
                Login to continue
              </h2>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                We&apos;ll send a 6-digit OTP to verify your identity
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="login-name" className="label">
                  Your Name *
                </label>
                <input
                  id="login-name"
                  type="text"
                  className="input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="login-phone" className="label">
                  Phone Number *
                </label>
                <input
                  ref={phoneRef}
                  id="login-phone"
                  type="tel"
                  className="input"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              <div>
                <label htmlFor="login-email" className="label">
                  Email{" "}
                  <span className="text-ink-400 font-normal">(optional)</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="input"
                  placeholder="e.g. name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 text-sm font-medium text-red-500">{error}</p>
            )}

            <button
              onClick={sendOtp}
              disabled={loading}
              className="btn-primary mt-6 w-full justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Sending OTP…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send OTP
                  <Icon name="arrowRight" size={16} />
                </span>
              )}
            </button>
          </div>
        )}

        {/* ─── Step 2: OTP Verification ─── */}
        {step === "otp" && (
          <div>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-500/10 text-electric-500">
                <Icon name="shieldCheck" size={28} />
              </div>
              <h2 className="text-xl font-bold text-ink-900 dark:text-white">
                Verify OTP
              </h2>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-ink-700 dark:text-ink-200">{phone}</span>
              </p>
            </div>

            {/* Dev mode OTP hint */}
            {devOtp && (
              <div className="mb-4 rounded-xl border border-electric-300/30 bg-electric-50 px-4 py-3 text-center dark:border-electric-500/20 dark:bg-electric-900/20">
                <p className="text-xs text-ink-500 dark:text-ink-400">
                  Dev mode — your OTP is:
                </p>
                <p className="mt-0.5 font-mono text-2xl font-bold tracking-[0.3em] text-electric-600 dark:text-electric-400">
                  {devOtp}
                </p>
              </div>
            )}

            {/* OTP input boxes */}
            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="h-14 w-12 rounded-xl border-2 border-ink-200 bg-white text-center font-mono text-xl font-bold text-ink-900 transition-all focus:border-flame-500 focus:outline-none focus:ring-2 focus:ring-flame-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white dark:focus:border-flame-400"
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            {error && (
              <p className="mt-3 text-center text-sm font-medium text-red-500">{error}</p>
            )}

            {loading && (
              <div className="mt-4 flex justify-center">
                <span className="flex items-center gap-2 text-sm text-ink-500">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-300 border-t-flame-500" />
                  Verifying…
                </span>
              </div>
            )}

            {/* Resend / change phone */}
            <div className="mt-6 flex items-center justify-between text-sm">
              <button
                onClick={() => { setStep("phone"); setError(""); }}
                className="text-ink-500 underline-offset-2 hover:text-ink-700 hover:underline dark:text-ink-400"
              >
                ← Change number
              </button>
              {countdown > 0 ? (
                <span className="text-ink-400">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="font-medium text-flame-500 underline-offset-2 hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {/* ─── Step 3: Done ─── */}
        {step === "done" && (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <Icon name="checkCircle" size={36} />
            </div>
            <h2 className="text-xl font-bold text-ink-900 dark:text-white">
              Verified!
            </h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
              You&apos;re now logged in. Redirecting to checkout…
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
