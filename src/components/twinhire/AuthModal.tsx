"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Mode = "login" | "waitlist";

const DEMO_ACCOUNTS = [
  {
    label: "Demo Candidate",
    email: "demo-candidate@twinhire.app",
    password: "demo1234",
    desc: "Full simulation experience",
    icon: User,
  },
  {
    label: "Demo Admin",
    email: "demo-admin@twinhire.app",
    password: "demo1234",
    desc: "Manage waitlist + full app",
    icon: Lock,
  },
];

export function AuthModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [waitlisted, setWaitlisted] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else if (res?.ok) {
      onSuccess?.();
      onClose();
      window.location.reload();
    }
  };

  const handleWaitlist = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.status === "already_registered") {
        setError("This email already has an account. Try signing in.");
      } else {
        setWaitlisted(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email: demoEmail,
      password: demoPassword,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      onSuccess?.();
      onClose();
      window.location.reload();
    } else {
      setError("Demo login failed.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative border-b border-border/60 px-6 pb-4 pt-6">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/[0.06] to-transparent" />
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-lg leading-tight">
                    {mode === "login" ? "Welcome to TwinHire" : "Join the waitlist"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {mode === "login"
                      ? "Sign in to enter the talent network"
                      : "We'll create your account when a spot opens up"}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {waitlisted ? (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                  >
                    <Mail className="h-7 w-7" />
                  </motion.div>
                  <h4 className="mt-4 font-display text-xl">You're on the list</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We'll email you when your account is ready. An admin can approve
                    you at any time.
                  </p>
                  <Button
                    onClick={() => {
                      setWaitlisted(false);
                      setMode("login");
                      setEmail("");
                      setPassword("");
                      setName("");
                    }}
                    variant="outline"
                    className="mt-5 h-10 w-full rounded-full"
                  >
                    Back to sign in
                  </Button>
                </div>
              ) : (
                <>
                  {/* Mode tabs */}
                  <div className="mb-4 flex gap-1 rounded-full bg-secondary/60 p-1">
                    <button
                      onClick={() => setMode("login")}
                      className={cn(
                        "flex-1 rounded-full py-1.5 text-xs font-medium transition-colors",
                        mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
                      )}
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => setMode("waitlist")}
                      className={cn(
                        "flex-1 rounded-full py-1.5 text-xs font-medium transition-colors",
                        mode === "waitlist" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
                      )}
                    >
                      Join waitlist
                    </button>
                  </div>

                  {/* Form */}
                  <div className="space-y-3">
                    {mode === "waitlist" && (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-11 rounded-xl pl-10"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (mode === "login" ? handleLogin() : handleWaitlist())}
                        className="h-11 rounded-xl pl-10"
                      />
                    </div>
                    {mode === "login" && (
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                          className="h-11 rounded-xl pl-10"
                        />
                      </div>
                    )}

                    {error && (
                      <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                        {error}
                      </p>
                    )}

                    <Button
                      onClick={mode === "login" ? handleLogin : handleWaitlist}
                      disabled={loading || !email}
                      className="h-11 w-full gap-1.5 rounded-xl"
                    >
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Please wait…</>
                      ) : (
                        <>
                          {mode === "login" ? "Sign in" : "Join the waitlist"}
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Quick login */}
                  {mode === "login" && (
                    <div className="mt-5">
                      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        <span className="h-px flex-1 bg-border" />
                        Quick demo login
                        <span className="h-px flex-1 bg-border" />
                      </div>
                      <div className="mt-3 space-y-2">
                        {DEMO_ACCOUNTS.map((acc) => (
                          <button
                            key={acc.email}
                            onClick={() => handleDemoLogin(acc.email, acc.password)}
                            disabled={loading}
                            className="group flex w-full items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-3 text-left transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
                          >
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                              <acc.icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium">{acc.label}</div>
                              <div className="text-[11px] text-muted-foreground">{acc.desc}</div>
                            </div>
                            <Zap className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
