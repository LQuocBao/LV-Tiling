"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight, Loader2, Globe } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<"en" | "vi">("en");
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
          localStorage.setItem("lv_admin_lang", lang);
        }
        setTimeout(() => {
          router.push("/admin");
        }, 300);
      } else {
        setLoading(false);
        setError(
          data.error ||
            (lang === "en"
              ? "Invalid username or password."
              : "Tên đăng nhập hoặc mật khẩu không chính xác.")
        );
      }
    } catch {
      setLoading(false);
      setError(
        lang === "en"
          ? "Server connection error. Please try again."
          : "Lỗi kết nối máy chủ. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-sm w-full p-6 sm:p-8 rounded-[8px] bg-white border border-slate-200 shadow-sm space-y-6 relative">
        
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200 text-[11px] font-semibold">
          <Globe className="w-3 h-3 text-slate-500 ml-1" />
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              lang === "en"
                ? "bg-[#dc2626] text-white font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("vi")}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              lang === "vi"
                ? "bg-[#dc2626] text-white font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            VI
          </button>
        </div>

        {/* Brand Header with real logo */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative h-14 w-14 mx-auto rounded-[8px] bg-white p-1.5 border border-slate-200 flex items-center justify-center shadow-xs">
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
              {lang === "en" ? "Perth Master Tilers • Control Panel" : "Perth Master Tilers • Bảng Quản Trị"}
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
            <label className="text-xs font-semibold text-slate-700">
              {lang === "en" ? "Username" : "Tên đăng nhập"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoComplete="username"
                placeholder={lang === "en" ? "Enter your username" : "Nhập tên đăng nhập"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-[6px] bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-[#dc2626]"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700">
              {lang === "en" ? "Password" : "Mật khẩu"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder={lang === "en" ? "Enter your password" : "Nhập mật khẩu"}
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
                  <span>{lang === "en" ? "Signing in..." : "Đang đăng nhập..."}</span>
                </>
              ) : (
                <>
                  <span>{lang === "en" ? "Sign In to Admin" : "Đăng Nhập Quản Trị"}</span>
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
            {lang === "en" ? "← Return to Main Website" : "← Quay lại Trang Chủ Website"}
          </a>
        </div>

      </div>
    </div>
  );
}
