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
      }, 500);
    } else {
      setLoading(false);
      setError("Invalid username or password. Default: admin / admin123");
    }
  };

  return (
    <div className="min-h-screen bg-[#070a0f] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#121824] border border-gray-800 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#e53835] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-red-900/40">
            LV
          </div>
          <h1 className="text-2xl font-black text-white">LV Tiling Admin CMS</h1>
          <p className="text-xs text-gray-400">
            Landing Page Content & Lead Management Portal
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-300">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090d14] border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#e53835]"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-gray-300">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090d14] border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#e53835]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-[#e53835] hover:bg-[#ff4d49] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-900/30"
            >
              <span>{loading ? "Verifying..." : "Sign In to CMS"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-gray-800 text-center space-y-2">
          <div className="text-[11px] text-gray-400">
            Default credentials: <span className="text-white font-mono">admin</span> / <span className="text-white font-mono">admin123</span>
          </div>
          <a
            href="/"
            className="text-xs text-gray-400 hover:text-white transition-colors block"
          >
            ← Back to Public Landing Page
          </a>
        </div>

      </div>
    </div>
  );
}
