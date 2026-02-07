"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import {
  ShoppingBag,
  ArrowLeft,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  sendVerificationCode,
  resetPassword,
} from "@/lib/api/verification";
import { useCountdown } from "@/lib/hooks/use-countdown";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [codeSentAt, setCodeSentAt] = useState(0);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
  };

  const { formatted: countdownFormatted, isExpired: countdownExpired } =
    useCountdown(step === "reset", codeSentAt);

  useEffect(() => {
    if (countdownExpired) {
      setVerificationCode("");
    }
  }, [countdownExpired]);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const sentParam = searchParams.get("sent");
    if (emailParam) {
      setEmail(emailParam);
      setStep("reset");
    }
    if (sentParam) {
      const sent = parseInt(sentParam, 10);
      if (!isNaN(sent)) setCodeSentAt(sent);
    }
  }, [searchParams]);

  const sendCodeMutation = useMutation({
    mutationFn: () =>
      sendVerificationCode({ email: email.trim(), purpose: "password_reset" }),
    onSuccess: () => {
      setStep("reset");
      setCodeSentAt(Date.now());
      setMessage(null);
      showMessage("success", "인증 코드가 이메일로 발송되었습니다.");
    },
    onError: (err: Error & { info?: { message?: string } }) => {
      showMessage(
        "error",
        err?.info?.message ?? err?.message ?? "인증 코드 발송에 실패했습니다."
      );
    },
  });

  const resetMutation = useMutation({
    mutationFn: () =>
      resetPassword({
        email: email.trim(),
        verificationCode,
        newPassword,
      }),
    onSuccess: () => {
      setMessage(null);
      showMessage("success", "비밀번호가 재설정되었습니다. 로그인해주세요.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    },
    onError: (err: Error & { info?: { message?: string } }) => {
      showMessage(
        "error",
        err?.info?.message ?? err?.message ?? "비밀번호 재설정에 실패했습니다."
      );
    },
  });

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email.trim()) {
      showMessage("error", "이메일을 입력해주세요.");
      return;
    }
    sendCodeMutation.mutate();
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!verificationCode.trim()) {
      showMessage("error", "인증 코드를 입력해주세요.");
      return;
    }
    if (newPassword.length < 8) {
      showMessage("error", "비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage("error", "비밀번호가 일치하지 않습니다.");
      return;
    }
    resetMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-yellow-400 hover:opacity-90 transition-opacity">
                <ShoppingBag className="h-5 w-5 text-black" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">비밀번호 찾기</h1>
                <p className="text-xs text-zinc-400">이메일 인증 후 재설정</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="w-full max-w-md">
            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {step === "email" ? "이메일 입력" : "비밀번호 재설정"}
                </CardTitle>
                <p className="text-zinc-400 text-sm">
                  {step === "email"
                    ? "가입한 이메일로 인증 코드를 받습니다"
                    : "인증 코드와 새 비밀번호를 입력하세요"}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {message && (
                  <Alert
                    variant={message.type}
                    className="animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    {message.text}
                  </Alert>
                )}

                {step === "email" && (
                  <Alert variant="info" className="py-3">
                    이메일로 가입한 계정만 비밀번호 찾기가 가능합니다.
                  </Alert>
                )}

                {step === "email" ? (
                  <form onSubmit={handleSendCode} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        이메일
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                        <Input
                          type="email"
                          placeholder="가입한 이메일을 입력하세요"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={sendCodeMutation.isPending}
                      className="w-full h-12 bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 font-semibold"
                    >
                      {sendCodeMutation.isPending
                        ? "발송 중..."
                        : "인증 코드 발송"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleReset} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        이메일 인증 코드
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                          <Input
                            type="text"
                            placeholder="6자리 인증 코드"
                            value={verificationCode}
                            onChange={(e) =>
                              setVerificationCode(
                                e.target.value.replace(/\D/g, "").slice(0, 6)
                              )
                            }
                            maxLength={6}
                            disabled={countdownExpired}
                            className="pl-12 h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20 text-center text-lg tracking-widest disabled:opacity-60"
                          />
                        </div>
                        {countdownExpired && (
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 shrink-0 bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold px-6"
                            onClick={() => sendCodeMutation.mutate()}
                            disabled={sendCodeMutation.isPending}
                          >
                            {sendCodeMutation.isPending ? "발송 중..." : "재발송"}
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm font-mono tabular-nums ${
                            countdownExpired ? "text-red-400" : "text-lime-400"
                          }`}
                        >
                          {countdownExpired
                            ? "인증 코드가 만료되었습니다."
                            : `유효 시간: ${countdownFormatted}`}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        새 비밀번호
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="비밀번호 (최소 8자)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-12 pr-12 h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        새 비밀번호 확인
                      </label>
                      <Input
                        type="password"
                        placeholder="비밀번호 재입력"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={resetMutation.isPending || countdownExpired}
                      className="w-full h-12 bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 font-semibold"
                    >
                      {resetMutation.isPending
                        ? "재설정 중..."
                        : "비밀번호 재설정"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-zinc-400"
                      onClick={() => setStep("email")}
                    >
                      이전으로
                    </Button>
                  </form>
                )}

                <div className="text-center pt-4">
                  <Link
                    href="/login"
                    className="text-sm text-lime-400 hover:text-lime-300 font-semibold"
                  >
                    로그인으로 돌아가기
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
