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
  User,
  Eye,
  EyeOff,
  Chrome,
  KeyRound,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  sendVerificationCode,
  verifySignupCode,
  signupWithVerification,
} from "@/lib/api/verification";
import { useCountdown } from "@/lib/hooks/use-countdown";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [codeSentAt, setCodeSentAt] = useState(0);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
  };

  const { formatted: countdownFormatted, isExpired: countdownExpired } =
    useCountdown(!!codeSentAt, codeSentAt);

  useEffect(() => {
    if (countdownExpired) {
      setIsCodeVerified(false);
      setVerificationCode("");
    }
  }, [countdownExpired]);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const sentParam = searchParams.get("sent");
    const usernameParam = searchParams.get("username");
    const nameParam = searchParams.get("name");
    if (emailParam) setEmail(emailParam);
    if (usernameParam) setUsername(usernameParam);
    if (nameParam) setName(nameParam);
    if (sentParam) {
      const sent = parseInt(sentParam, 10);
      if (!isNaN(sent)) setCodeSentAt(sent);
    }
  }, [searchParams]);

  const sendCodeMutation = useMutation({
    mutationFn: () =>
      sendVerificationCode({
        email: email.trim(),
        purpose: "signup",
        username: username.trim() || undefined,
        name: name.trim() || undefined,
      }),
    onSuccess: () => {
      setCodeSentAt(Date.now());
      setVerificationCode("");
      setIsCodeVerified(false);
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

  const signupMutation = useMutation({
    mutationFn: () =>
      signupWithVerification({
        username: username.trim(),
        email: email.trim(),
        password,
        name: name.trim(),
        verificationCode,
      }),
    onSuccess: () => {
      setMessage(null);
      showMessage("success", "회원가입이 완료되었습니다. 로그인해주세요.");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    },
    onError: (err: Error & { info?: { message?: string } }) => {
      showMessage(
        "error",
        err?.info?.message ?? err?.message ?? "회원가입에 실패했습니다."
      );
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: () =>
      verifySignupCode({
        email: email.trim(),
        code: verificationCode.trim(),
      }),
    onSuccess: () => {
      setIsCodeVerified(true);
      setMessage(null);
      showMessage("success", "이메일 인증이 완료되었습니다.");
    },
    onError: (err: Error & { info?: { message?: string } }) => {
      showMessage(
        "error",
        err?.info?.message ?? err?.message ?? "인증 코드 확인에 실패했습니다."
      );
    },
  });

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!verificationCode.trim()) {
      showMessage("error", "인증 코드를 입력해주세요.");
      return;
    }
    if (verificationCode.trim().length !== 6) {
      showMessage("error", "6자리 인증 코드를 입력해주세요.");
      return;
    }
    if (countdownExpired) {
      showMessage("error", "인증 코드가 만료되었습니다. 다시 발송해주세요.");
      return;
    }
    verifyCodeMutation.mutate();
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!email.trim()) {
      showMessage("error", "이메일을 입력해주세요.");
      return;
    }
    sendCodeMutation.mutate();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!username.trim() || !email.trim() || !password.trim() || !name.trim()) {
      showMessage("error", "모든 항목을 입력해주세요.");
      return;
    }
    if (password.length < 8) {
      showMessage("error", "비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (!codeSentAt) {
      showMessage("error", "먼저 인증 코드를 발송해주세요.");
      return;
    }
    if (!verificationCode.trim()) {
      showMessage("error", "인증 코드를 입력해주세요.");
      return;
    }
    if (!isCodeVerified) {
      showMessage("error", "인증 코드 확인 버튼을 눌러 이메일 인증을 먼저 완료해주세요.");
      return;
    }
    if (countdownExpired) {
      showMessage("error", "인증 코드가 만료되었습니다. 다시 발송해주세요.");
      return;
    }
    signupMutation.mutate();
  };

  const googleLoginUrl = "/api/auth/google";
  const kakaoLoginUrl = "/api/auth/kakao";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
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
              <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-yellow-400 smooth-shadow-lg shadow-lime-400/20 hover:opacity-90 transition-opacity">
                <ShoppingBag className="h-5 w-5 text-black" />
              </Link>
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
                  이메일 인증 후 가입을 완료합니다
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
                <form onSubmit={handleSignup} className="space-y-5">
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

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-zinc-300"
                    >
                      이메일
                    </label>
                    <div className="flex items-end gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="이메일을 입력하세요"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setCodeSentAt(0);
                            setVerificationCode("");
                            setIsCodeVerified(false);
                          }}
                          className="pl-12 h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleSendCode}
                        disabled={sendCodeMutation.isPending || !email.trim()}
                        className="h-12 shrink-0 bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                      >
                        {sendCodeMutation.isPending ? "발송 중..." : "인증 코드 발송"}
                      </Button>
                    </div>
                  </div>

                  {codeSentAt > 0 && (
                    <div className="space-y-2">
                      <label
                        htmlFor="verificationCode"
                        className="text-sm font-medium text-zinc-300"
                      >
                        이메일 인증 코드
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
                          <Input
                            id="verificationCode"
                            type="text"
                            placeholder="6자리 인증 코드"
                            value={verificationCode}
                            onChange={(e) => {
                              setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                              setIsCodeVerified(false);
                            }}
                            maxLength={6}
                            disabled={countdownExpired}
                            className="pl-12 h-12 border-zinc-800 bg-zinc-950/50 text-white placeholder:text-zinc-500 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20 text-center text-lg tracking-widest disabled:opacity-60"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={
                            countdownExpired
                              ? () => sendCodeMutation.mutate()
                              : handleVerifyCode
                          }
                          disabled={
                            countdownExpired
                              ? sendCodeMutation.isPending
                              : isCodeVerified ||
                                verifyCodeMutation.isPending ||
                                verificationCode.trim().length !== 6
                          }
                          className="h-12 shrink-0 bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold px-6 disabled:opacity-100 disabled:bg-lime-400/20"
                        >
                          {countdownExpired
                            ? sendCodeMutation.isPending
                              ? "발송 중..."
                              : "재발송"
                            : isCodeVerified
                              ? "확인됨"
                              : verifyCodeMutation.isPending
                                ? "확인 중..."
                                : "확인"}
                        </Button>
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
                  )}

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

                  <Button
                    type="submit"
                    disabled={
                      signupMutation.isPending ||
                      !codeSentAt ||
                      !verificationCode.trim() ||
                      !isCodeVerified ||
                      countdownExpired
                    }
                    className="w-full h-12 bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 smooth-shadow-lg shadow-lime-400/30 hover:shadow-lime-400/50 transition-all duration-300 font-semibold"
                  >
                    {signupMutation.isPending ? "가입 중..." : "회원가입하기"}
                  </Button>
                </form>

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

                <a href={kakaoLoginUrl}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:border-zinc-700 bg-[#FEE500] hover:bg-[#FEE500]/90 border-[#FEE500] text-black"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    카카오로 계속하기
                  </Button>
                </a>

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
