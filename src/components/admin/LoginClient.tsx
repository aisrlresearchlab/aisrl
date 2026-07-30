"use client";

import React, { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Check auth state on mount; redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin");
      } else {
        setIsCheckingAuth(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // GSAP: Card Entry animation
  useEffect(() => {
    if (!isCheckingAuth) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [isCheckingAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/admin");
    } catch (err: any) {
      console.error("Firebase Sign In Error:", err);
      // Clean up common error messages to look professional
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("Invalid email address or password. Please try again.");
      } else {
        setError(err.message || "An unexpected error occurred. Please try again.");
      }
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="w-full min-h-screen bg-background text-foreground flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border border-keel border-t-accent animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase text-muted">Securing Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-12 font-sans selection:bg-accent selection:text-background"
    >
      <div
        ref={cardRef}
        className="w-full max-w-md p-8 border border-keel rounded bg-stone-50/10 dark:bg-stone-900/5 flex flex-col gap-8 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <span className="text-xs font-mono tracking-widest uppercase text-accent">
            AISRL Authentication Portal
          </span>
          <h1 className="font-serif text-3xl font-extralight tracking-tight">
            Administrator Sign In
          </h1>
          <p className="text-xs text-muted font-light leading-relaxed">
            Enter your credentials below to access the Applied Intelligent Systems Research Lab (AISRL) administration panel.
          </p>
        </div>

        <hr className="border-t border-keel" />

        {/* Error Callout */}
        {error && (
          <div className="border border-destructive/30 bg-destructive/5 text-destructive p-3.5 rounded text-xs leading-relaxed font-light">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest uppercase text-muted font-light">
              Email Address
            </label>
            <input
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 bg-background border border-keel rounded text-sm focus:border-accent outline-none disabled:opacity-50 transition-colors"
              placeholder="e.g. admin@aisrl.org"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs tracking-widest uppercase text-muted font-light">
              Password
            </label>
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 bg-background border border-keel rounded text-sm focus:border-accent outline-none disabled:opacity-50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-2 px-5 py-3.5 rounded bg-accent text-background hover:opacity-90 disabled:opacity-50 transition-opacity font-mono text-xs tracking-wider uppercase cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-background border-t-transparent animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="flex justify-between items-center text-[10px] tracking-widest uppercase text-muted font-light mt-2 border-t border-keel pt-4">
          <a href="/" className="hover:text-accent transition-colors">
            ← Back to Site
          </a>
          <span>AISRL v1.0</span>
        </div>
      </div>
    </div>
  );
}
