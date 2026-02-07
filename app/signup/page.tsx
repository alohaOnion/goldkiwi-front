"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Chrome,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuthControllerSignup } from "@/lib/api/goldkiwi";
import { apiFetchOptions } from "@/lib/api/config";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signupMutation = useAuthControllerSignup({
    mutation: {
      onSuccess: () => {
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        window.location.href = "/login";
      },
      onError: (err: Error & { info?: { message?: string }; status?: number }) => {
        const msg = err?.info?.message ?? err?.message ?? "회원가입에 실패했습니다.";
        alert(msg);
      },
    },
    fetch: { credentials: "include", ...apiFetchOptions },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim() || !name.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    if (password.length < 8) {
      alert("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    signupMutation.mutate({
      data: {
        username: username.trim(),
        email: email.trim(),
        password,
        name: name.trim(),
      },
    });
  };

  const googleLoginUrl = "/api/auth/google";

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
                  회원가입
                </CardTitle>
                <p className="text-zinc-400 text-sm">
                  골드키위와 함께 시작하세요
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 아이디 */}
                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="text-sm font-medium text-zinc-300"
                    >
                      아이디
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="사용할 아이디를 입력하세요"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-12 h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20"
                      />
                    </div>
                  </div>

                  {/* 이메일 */}
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

                  {/* 비밀번호 */}
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
                        placeholder="비밀번호 (최소 8자)"
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

                  {/* 이름 */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-zinc-300"
                    >
                      이름
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="이름을 입력하세요"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20"
                    />
                  </div>

                  {/* 회원가입 버튼 */}
                  <Button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full h-12 bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 smooth-shadow-lg shadow-lime-400/30 hover:shadow-lime-400/50 transition-all duration-300 font-semibold"
                  >
                    {signupMutation.isPending ? "가입 중..." : "회원가입"}
                  </Button>
                </form>

                {/* 구분선 */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900 px-2 text-zinc-500">
                      또는
                    </span>
                  </div>
                </div>

                {/* Google 로그인 */}
                <a href={googleLoginUrl}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:border-zinc-700"
                  >
                    <Chrome className="h-5 w-5 mr-2" />
                    Google로 계속하기
                  </Button>
                </a>

                {/* 로그인 링크 */}
                <div className="text-center pt-4">
                  <p className="text-sm text-zinc-400">
                    이미 계정이 있으신가요?{" "}
                    <Link
                      href="/login"
                      className="text-lime-400 hover:text-lime-300 font-semibold transition-colors"
                    >
                      로그인
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
