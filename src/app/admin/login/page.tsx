"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("lv_admin_auth", "true");
          localStorage.setItem("lv_admin_user", JSON.stringify(data.user));
        }
        setTimeout(() => {
          router.push("/admin");
        }, 300);
      } else {
        setLoading(false);
        setError(data.error || "Tên đăng nhập hoặc mật khẩu không chính xác.");
      }
    } catch {
      setLoading(false);
      setError("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-sm w-full p-6 sm:p-8 rounded-[6px] bg-white border border-slate-200 shadow-sm space-y-6">
        
        {/* Brand Header with real logo */}
        <div className="text-center space-y-3">
          <div className="relative h-14 w-14 mx-auto rounded-[6px] bg-white p-1.5 border border-slate-200 flex items-center justify-center shadow-xs">
            <Image
              src="/logo.png"
              alt="LV Tiling Logo"
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight uppercase">LV TILING</h1>
            <p className="text-xs font-semibold text-[#dc2626] uppercase tracking-wider">
              Perth Master Tilers • Control Panel
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-[6px] bg-red-50 border border-red-300 text-red-900 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Tên đăng nhập / Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#dc2626]"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Mật khẩu / Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#dc2626]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-[6px] font-semibold text-xs text-white bg-[#dc2626] hover:bg-[#b91c1c] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng Nhập Quản Trị</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs">
          <a
            href="/"
            className="text-slate-500 hover:text-slate-900 transition-colors inline-block text-[11px]"
          >
            ← Quay lại Trang Chủ Website
          </a>
        </div>

      </div>
    </div>
  );
}
