"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Standard credential check
    if (
      (username === "admin" && password === "lvtiling2026") ||
      (username === "admin" && password === "admin123")
    ) {
      if (typeof window !== "undefined") {
        localStorage.setItem("lv_admin_auth", "true");
        localStorage.setItem("lv_admin_user", username);
      }
      setTimeout(() => {
        router.push("/admin");
      }, 400);
    } else {
      setLoading(false);
      setError("Invalid username or password. Default: admin / admin123");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-sm w-full p-6 sm:p-8 rounded-[6px] bg-white border border-slate-200 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 mx-auto rounded-[6px] bg-[#dc2626] flex items-center justify-center text-white font-black text-lg">
            LV
          </div>
          <h1 className="text-lg font-bold text-slate-900">LV Tiling Admin CMS</h1>
          <p className="text-xs text-slate-500">
            Landing Page &amp; Leads Management Portal
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-[6px] bg-red-50 border border-red-300 text-red-900 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-[6px] font-semibold text-xs text-white bg-[#dc2626] hover:bg-[#b91c1c] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? "Signing in..." : "Sign In to CMS"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs">
          <div className="text-slate-500 text-[11px]">
            Default: <span className="font-mono font-semibold text-slate-800">admin</span> / <span className="font-mono font-semibold text-slate-800">admin123</span>
          </div>
          <a
            href="/"
            className="text-slate-500 hover:text-slate-900 transition-colors block"
          >
            ← Back to Public Website
          </a>
        </div>

      </div>
    </div>
  );
}
