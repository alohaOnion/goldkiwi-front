"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import {
  ShoppingBag,
  ArrowLeft,
  Mail,
  KeyRound,
  User,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  sendVerificationCode,
  findUsername,
} from "@/lib/api/verification";
import { useCountdown } from "@/lib/hooks/use-countdown";

export default function FindUsernamePage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"email" | "verify" | "result">("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [codeSentAt, setCodeSentAt] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopyUsername = async () => {
    try {
      await navigator.clipboard.writeText(username);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage({ type: "error", text: "복사에 실패했습니다." });
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
  };

  const { formatted: countdownFormatted, isExpired: countdownExpired } =
    useCountdown(step === "verify", codeSentAt);

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
      setStep("verify");
    }
    if (sentParam) {
      const sent = parseInt(sentParam, 10);
      if (!isNaN(sent)) setCodeSentAt(sent);
    }
  }, [searchParams]);

  const sendCodeMutation = useMutation({
    mutationFn: () =>
      sendVerificationCode({
        email: email.trim(),
        purpose: "find_username",
      }),
    onSuccess: () => {
      setStep("verify");
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

  const findUsernameMutation = useMutation({
    mutationFn: () =>
      findUsername({
        email: email.trim(),
        verificationCode,
      }),
    onSuccess: (data) => {
      setUsername(data.username);
      setStep("result");
      setMessage(null);
    },
    onError: (err: Error & { info?: { message?: string } }) => {
      showMessage(
        "error",
        err?.info?.message ?? err?.message ?? "아이디 찾기에 실패했습니다."
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

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!verificationCode.trim()) {
      showMessage("error", "인증 코드를 입력해주세요.");
      return;
    }
    if (verificationCode.length !== 6) {
      showMessage("error", "6자리 인증 코드를 입력해주세요.");
      return;
    }
    findUsernameMutation.mutate();
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
                <h1 className="text-xl font-bold text-white">아이디 찾기</h1>
                <p className="text-xs text-zinc-400">이메일 인증 후 확인</p>
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
                  {step === "email"
                    ? "이메일 입력"
                    : step === "verify"
                      ? "인증 코드 입력"
                      : "아이디 확인"}
                </CardTitle>
                <p className="text-zinc-400 text-sm">
                  {step === "email"
                    ? "가입한 이메일로 인증 코드를 받습니다"
                    : step === "verify"
                      ? "이메일로 받은 6자리 인증 코드를 입력하세요"
                      : "가입 시 사용한 아이디입니다"}
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
                    이메일로 가입한 계정만 아이디 찾기가 가능합니다.
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
                ) : step === "verify" ? (
                  <form onSubmit={handleVerify} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-300">
                        이메일
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                        <Input
                          type="email"
                          placeholder="가입한 이메일"
                          value={email}
                          readOnly
                          className="pl-12 h-12 border-zinc-800 bg-zinc-950/50 text-zinc-400"
                        />
                      </div>
                    </div>

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

                    <Button
                      type="submit"
                      disabled={
                        findUsernameMutation.isPending ||
                        countdownExpired ||
                        verificationCode.length !== 6
                      }
                      className="w-full h-12 bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 font-semibold"
                    >
                      {findUsernameMutation.isPending
                        ? "확인 중..."
                        : "아이디 찾기"}
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
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                      <p className="text-xs text-zinc-500 mb-1">아이디</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-lime-400 flex items-center gap-2 flex-1 min-w-0">
                          <User className="h-5 w-5 shrink-0" />
                          <span className="truncate">{username}</span>
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0 bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                          onClick={handleCopyUsername}
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              복사됨
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              복사하기
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <Link href="/login">
                      <Button
                        className="w-full h-12 bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 font-semibold"
                      >
                        로그인하기
                      </Button>
                    </Link>
                  </div>
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
