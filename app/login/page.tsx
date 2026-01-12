"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Github,
  Chrome,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-zinc-950/60 supports-[backdrop-filter]:backdrop-blur-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-yellow-400 smooth-shadow-lg shadow-lime-400/20">
                <ShoppingBag className="h-5 w-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">골드키위</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-full max-w-md">
            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm smooth-shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-400 to-yellow-400 smooth-shadow-lg shadow-lime-400/20">
                    <ShoppingBag className="h-8 w-8 text-black" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  로그인
                </CardTitle>
                <p className="text-zinc-400 text-sm">
                  골드키위에 오신 것을 환영합니다
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 이메일 입력 */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-zinc-300"
                  >
                    이메일
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20"
                    />
                  </div>
                </div>

                {/* 비밀번호 입력 */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-zinc-300"
                  >
                    비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 자동 로그인 & 비밀번호 찾기 */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-lime-400 focus:ring-2 focus:ring-lime-400/20 focus:ring-offset-0 focus:ring-offset-zinc-900"
                    />
                    <span className="text-zinc-400">자동 로그인</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-lime-400 hover:text-lime-300 transition-colors"
                  >
                    비밀번호 찾기
                  </Link>
                </div>

                {/* 로그인 버튼 */}
                <Button
                  className="w-full h-12 bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 smooth-shadow-lg shadow-lime-400/30 hover:shadow-lime-400/50 transition-all duration-300 font-semibold"
                  onClick={() => {
                    // 로그인 로직
                    console.log("Login:", { email, password });
                  }}
                >
                  로그인
                </Button>

                {/* 구분선 */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900 px-2 text-zinc-500">또는</span>
                  </div>
                </div>

                {/* 소셜 로그인 */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-12 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:border-zinc-700"
                  >
                    <Github className="h-5 w-5 mr-2" />
                    GitHub로 로그인
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:border-zinc-700"
                  >
                    <Chrome className="h-5 w-5 mr-2" />
                    Google로 로그인
                  </Button>
                </div>

                {/* 회원가입 링크 */}
                <div className="text-center pt-4">
                  <p className="text-sm text-zinc-400">
                    계정이 없으신가요?{" "}
                    <Link
                      href="/signup"
                      className="text-lime-400 hover:text-lime-300 font-semibold transition-colors"
                    >
                      회원가입
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 추가 정보 */}
            <div className="mt-6 text-center">
              <p className="text-xs text-zinc-500">
                로그인하시면 골드키위의{" "}
                <Link
                  href="/terms"
                  className="text-zinc-400 hover:text-zinc-300 underline"
                >
                  이용약관
                </Link>
                과{" "}
                <Link
                  href="/privacy"
                  className="text-zinc-400 hover:text-zinc-300 underline"
                >
                  개인정보처리방침
                </Link>
                에 동의하는 것으로 간주됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

