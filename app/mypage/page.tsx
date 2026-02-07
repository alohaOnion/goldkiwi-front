"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  ArrowLeft,
  User,
  Mail,
  Chrome,
  MessageCircle,
  LogOut,
  Edit3,
  X,
  ChevronRight,
  Shield,
  History,
  Lock,
  Eye,
  EyeOff,
  HelpCircle,
  KeyRound,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { HistoryListSkeleton } from "@/components/ui/list-skeleton";
import {
  useProfile,
  useUpdateProfile,
  useSendEmailChangeCode,
  useVerifyEmailChangeCode,
  useChangePassword,
  useActivities,
  useLoginHistory,
} from "@/lib/hooks/use-profile";
import { useCountdown } from "@/lib/hooks/use-countdown";
import { useAuthControllerLogout } from "@/lib/api/goldkiwi";
import { apiFetchOptions } from "@/lib/api/config";
import { useQueryClient } from "@tanstack/react-query";

type Section = "profile" | "security" | "history";

export default function MypagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: profile, isLoading, error } = useProfile();
  const { data: activities, isLoading: isActivitiesLoading } = useActivities(!!profile);
  const { data: loginHistory, isLoading: isLoginHistoryLoading } = useLoginHistory(!!profile);
  const updateMutation = useUpdateProfile();
  const sendEmailChangeCodeMutation = useSendEmailChangeCode();
  const verifyEmailChangeCodeMutation = useVerifyEmailChangeCode();
  const changePasswordMutation = useChangePassword();
  const logoutMutation = useAuthControllerLogout({
    mutation: {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["me"] });
        queryClient.removeQueries({ queryKey: ["profile"] });
        window.location.replace("/");
      },
    },
    fetch: { credentials: "include", ...apiFetchOptions },
  });

  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // 이메일 변경 인증
  const [verificationCode, setVerificationCode] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCodeSentAt, setEmailCodeSentAt] = useState(0);
  const [emailCodeVerified, setEmailCodeVerified] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 비밀번호 변경
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const isOAuthUser = profile?.googleId || profile?.kakaoId;
  const { formatted: countdownFormatted, isExpired: countdownExpired } =
    useCountdown(emailCodeSent, emailCodeSentAt);

  useEffect(() => {
    if (countdownExpired) {
      setEmailCodeVerified(false);
      setVerificationCode("");
    }
  }, [countdownExpired]);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setUsername(profile.username);
      setEmail(profile.email);
    }
  }, [profile]);

  useEffect(() => {
    if (!isLoading && error) {
      router.replace("/login");
    }
  }, [isLoading, error, router]);

  useEffect(() => {
    const sectionParam = searchParams.get("section");
    if (sectionParam === "history") {
      setActiveSection("history");
    }
  }, [searchParams]);

  useEffect(() => {
    if (profile && searchParams.get("edit") === "profile") {
      setActiveSection("profile");
      setIsEditing(true);
      const emailParam = searchParams.get("email");
      if (emailParam) {
        setEmail(emailParam);
        setEmailCodeSent(true);
        const sentParam = searchParams.get("sent");
        setEmailCodeSentAt(sentParam ? parseInt(sentParam, 10) : Date.now());
      }
    }
  }, [profile, searchParams]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);
    const emailChanged = profile && email.trim() !== profile.email;
    if (emailChanged && !verificationCode.trim()) {
      setProfileMessage({
        type: "error",
        text: "이메일을 변경하려면 먼저 '이메일 인증' 버튼을 눌러 입력한 이메일로 받은 6자리 인증 코드를 입력하세요.",
      });
      return;
    }
    if (emailChanged && verificationCode.trim() && !emailCodeVerified) {
      setProfileMessage({
        type: "error",
        text: "인증 코드를 입력한 뒤 '확인' 버튼으로 먼저 검증해주세요.",
      });
      return;
    }
    updateMutation.mutate(
      {
        name,
        email,
        ...(emailChanged && verificationCode && { verificationCode }),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setVerificationCode("");
          setEmailCodeSent(false);
          setEmailCodeVerified(false);
          setProfileMessage(null);
        },
        onError: (err: Error) => {
          setProfileMessage({ type: "error", text: err.message });
        },
      }
    );
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.name);
      setUsername(profile.username);
      setEmail(profile.email);
    }
    setVerificationCode("");
    setEmailCodeSent(false);
    setEmailCodeVerified(false);
    setProfileMessage(null);
    setIsEditing(false);
  };

  const handleVerifyEmailCode = () => {
    setProfileMessage(null);
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setProfileMessage({ type: "error", text: "6자리 인증 코드를 입력해주세요." });
      return;
    }
    if (!email.trim()) {
      setProfileMessage({ type: "error", text: "이메일을 입력해주세요." });
      return;
    }
    verifyEmailChangeCodeMutation.mutate(
      { email: email.trim(), code: verificationCode.trim() },
      {
        onSuccess: () => {
          setEmailCodeVerified(true);
          setProfileMessage({ type: "success", text: "인증 코드가 확인되었습니다." });
        },
        onError: (err: Error) => {
          setProfileMessage({ type: "error", text: err.message });
        },
      }
    );
  };

  const handleSendEmailCode = () => {
    setProfileMessage(null);
    if (!email.trim()) {
      setProfileMessage({ type: "error", text: "이메일을 입력해주세요." });
      return;
    }
    if (profile && email.trim() === profile.email) {
      setProfileMessage({ type: "error", text: "현재 이메일과 동일합니다." });
      return;
    }
    sendEmailChangeCodeMutation.mutate(email.trim(), {
      onSuccess: () => {
        setEmailCodeSent(true);
        setEmailCodeSentAt(Date.now());
        setEmailCodeVerified(false);
        setVerificationCode("");
        setProfileMessage({ type: "success", text: "인증 코드가 이메일로 발송되었습니다." });
      },
      onError: (err: Error) => {
        setProfileMessage({ type: "error", text: err.message });
      },
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    if (newPassword.length < 8) {
      alert("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    changePasswordMutation.mutate(
      {
        currentPassword: isOAuthUser ? undefined : currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          setShowPasswordModal(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          alert("비밀번호가 변경되었습니다.");
        },
        onError: (err: Error) => alert(err.message),
      }
    );
  };

  const handleLogout = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID ?? "goldkiwi-front";
    const clientSecret =
      process.env.NEXT_PUBLIC_CLIENT_SECRET ?? "goldkiwi-front-secret-dev";
    logoutMutation.mutate({ data: { clientId, clientSecret } });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatActivityDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return d.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split("@");
    if (!domain) return email;
    const masked =
      local.slice(0, 2) + "*".repeat(Math.max(0, local.length - 2));
    return `${masked}@${domain}`;
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-72 shrink-0">
              <Skeleton className="h-96 rounded-lg border border-zinc-800" />
            </aside>
            <main className="flex-1 min-w-0">
              <Skeleton className="h-[500px] rounded-lg border border-zinc-800" />
            </main>
          </div>
        </div>
      </div>
    );
  }

  const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "내프로필", icon: User },
    { id: "security", label: "보안설정", icon: Shield },
    { id: "history", label: "이력관리", icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl">
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
              <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-yellow-400 hover:opacity-90 transition-opacity">
                <ShoppingBag className="h-5 w-5 text-black" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">마이페이지</h1>
                <p className="text-xs text-zinc-400">골드키위 계정 관리</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 좌측 사이드바 */}
          <aside className="lg:w-72 shrink-0">
            <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-24">
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-yellow-400 text-3xl mb-4">
                    {profile.name.charAt(0) || "?"}
                  </div>
                  <p className="font-bold text-white text-lg">{profile.name}</p>
                  <p className="text-sm text-zinc-400 truncate max-w-full px-2">
                    {maskEmail(profile.email)}
                  </p>
                </div>

                <nav className="space-y-1">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveSection(id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        activeSection === id
                          ? "bg-lime-400/20 text-lime-400 border border-lime-400/30"
                          : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="font-medium">{label}</span>
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-zinc-800 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
                    asChild
                  >
                    <Link href="/">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      고객센터
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* 우측 메인 콘텐츠 */}
          <main className="flex-1 min-w-0">
            {/* 내프로필 섹션 */}
            {activeSection === "profile" && (
              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-6">
                <CardHeader className="border-b border-zinc-800">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-lime-400 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      내프로필
                    </CardTitle>
                    <ChevronRight className="h-5 w-5 text-zinc-500" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {isEditing ? (
                    <form onSubmit={handleSave} className="space-y-5">
                      {profileMessage && (
                        <Alert
                          variant={profileMessage.type}
                          className="animate-in fade-in slide-in-from-top-2 duration-300"
                        >
                          {profileMessage.text}
                        </Alert>
                      )}
                      <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">이름</p>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-10 border-zinc-800 bg-zinc-950/50 text-white w-64"
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? "저장 중..." : "저장"}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-zinc-800 gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-zinc-500 mb-1">이메일</p>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setEmailCodeSent(false);
                              setVerificationCode("");
                              setEmailCodeVerified(false);
                            }}
                            className="h-10 border-zinc-800 bg-zinc-950/50 text-white w-64"
                          />
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                            onClick={handleSendEmailCode}
                            disabled={
                              sendEmailChangeCodeMutation.isPending ||
                              !email.trim() ||
                              (!!profile && email.trim() === profile.email)
                            }
                          >
                            {sendEmailChangeCodeMutation.isPending
                              ? "발송 중..."
                              : "이메일 인증"}
                          </Button>
                        </div>
                      </div>
                      {emailCodeSent && (
                          <div className="flex flex-col gap-2 py-3 border-b border-zinc-800">
                            <div className="flex items-center gap-2">
                              <KeyRound className="h-5 w-5 text-zinc-500 shrink-0" />
                              <Input
                                type="text"
                                placeholder="6자리 인증 코드"
                                value={verificationCode}
                                onChange={(e) => {
                                  setVerificationCode(
                                    e.target.value.replace(/\D/g, "").slice(0, 6)
                                  );
                                  setEmailCodeVerified(false);
                                }}
                                maxLength={6}
                                disabled={countdownExpired}
                                className="h-10 border-zinc-800 bg-zinc-950/50 text-white w-40 text-center tracking-widest disabled:opacity-60"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="shrink-0 bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                                onClick={
                                  countdownExpired
                                    ? handleSendEmailCode
                                    : handleVerifyEmailCode
                                }
                                disabled={
                                  countdownExpired
                                    ? sendEmailChangeCodeMutation.isPending
                                    : verifyEmailChangeCodeMutation.isPending ||
                                      verificationCode.length !== 6 ||
                                      emailCodeVerified
                                }
                              >
                                {countdownExpired
                                  ? sendEmailChangeCodeMutation.isPending
                                    ? "발송 중..."
                                    : "재발송"
                                  : verifyEmailChangeCodeMutation.isPending
                                    ? "확인 중..."
                                    : emailCodeVerified
                                      ? "확인됨"
                                      : "확인"}
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-sm font-mono tabular-nums ${
                                  countdownExpired
                                    ? "text-red-400"
                                    : "text-lime-400"
                                }`}
                              >
                                {countdownExpired
                                  ? "인증 코드가 만료되었습니다."
                                  : `유효 시간: ${countdownFormatted}`}
                              </span>
                            </div>
                          </div>
                        )}
                      <div className="flex gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                          onClick={handleCancel}
                        >
                          취소
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">이름</p>
                          <p className="text-white font-medium">{profile.name}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          수정
                        </Button>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">아이디</p>
                          <p className="text-white font-medium">
                            {profile.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">이메일</p>
                          <p className="text-white font-medium">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">가입일</p>
                          <p className="text-white font-medium">
                            {formatDate(profile.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">
                            회원가입 경로
                          </p>
                          <div className="flex gap-2 mt-1">
                            {profile.googleId && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-sm">
                                <Chrome className="h-4 w-4" /> Google
                              </span>
                            )}
                            {profile.kakaoId && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-sm">
                                <MessageCircle className="h-4 w-4" /> 카카오
                              </span>
                            )}
                            {!profile.googleId && !profile.kakaoId && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300 text-sm">
                                <Mail className="h-4 w-4" /> 이메일
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <div>
                          <p className="text-xs text-zinc-500 mb-1">회원탈퇴</p>
                          <p className="text-zinc-400 text-sm">
                            계정을 삭제하면 복구할 수 없습니다.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-900/50 text-red-400 hover:bg-red-950/30"
                          disabled
                        >
                          탈퇴하기 (준비 중)
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 보안설정 섹션 */}
            {activeSection === "security" && (
              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-6">
                <CardHeader className="border-b border-zinc-800">
                  <CardTitle className="text-lg font-bold text-lime-400 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    보안설정
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                    <div>
                      <p className="text-white font-medium">비밀번호</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {isOAuthUser
                          ? "비밀번호를 설정하면 이메일/아이디로도 로그인할 수 있습니다."
                          : "비밀번호를 주기적으로 변경하시면 보안에 도움이 됩니다."}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      수정
                    </Button>
                  </div>
                  {!isOAuthUser && (
                    <div className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-white font-medium">비밀번호 찾기</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          비밀번호를 잊으셨다면 이메일 인증으로 재설정할 수 있습니다.
                        </p>
                      </div>
                      <Link href="/forgot-password">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                        >
                          비밀번호 찾기
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 이력관리 섹션 */}
            {activeSection === "history" && (
              <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-6">
                <CardHeader className="border-b border-zinc-800">
                  <CardTitle className="text-lg font-bold text-lime-400 flex items-center gap-2">
                    <History className="h-5 w-5" />
                    이력관리
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <p className="text-white font-medium mb-1">로그인 목록</p>
                    <p className="text-xs text-zinc-500 mb-4">
                      로그인한 IP와 시간 기록
                    </p>
                    <Link href="/mypage/login-history">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 font-semibold"
                      >
                        전체 보기
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-0 mb-6">
                    {isLoginHistoryLoading ? (
                      <HistoryListSkeleton count={3} />
                    ) : loginHistory && loginHistory.length > 0 ? (
                      loginHistory.slice(0, 3).map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                              <History className="h-4 w-4 text-zinc-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">
                                {log.ip ?? "-"}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {formatActivityDate(log.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-500 text-sm py-4 text-center">
                        로그인 이력이 없습니다.
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <p className="text-white font-medium mb-1">내 활동 기록</p>
                    <p className="text-xs text-zinc-500 mb-4">
                      로그인, 프로필 수정, 비밀번호 변경 등 계정 활동 내역
                    </p>
                    <Link href="/mypage/activities">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 font-semibold"
                      >
                        전체 보기
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-0">
                    {isActivitiesLoading ? (
                      <HistoryListSkeleton count={3} />
                    ) : activities && activities.length > 0 ? (
                      activities.slice(0, 3).map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                              <History className="h-4 w-4 text-zinc-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">
                                {activity.description ?? activity.type}
                              </p>
                              <p className="text-xs text-zinc-500">
                                {formatActivityDate(activity.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-500 text-sm py-8 text-center">
                        아직 활동 기록이 없습니다.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="border border-zinc-800 bg-zinc-900 w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-white">
                비밀번호 {isOAuthUser ? "설정" : "변경"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white"
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {!isOAuthUser && (
                  <div className="space-y-2">
                    <label className="text-sm text-zinc-300">
                      현재 비밀번호
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input
                        type={showCurrentPw ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="현재 비밀번호"
                        className="pl-10 border-zinc-800 bg-zinc-950 text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                      >
                        {showCurrentPw ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">새 비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호 (최소 8자)"
                      className="pl-10 border-zinc-800 bg-zinc-950 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    >
                      {showNewPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-300">
                    새 비밀번호 확인
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호 재입력"
                    className="border-zinc-800 bg-zinc-950 text-white"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-zinc-700"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="outline"
                    className="flex-1 bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending
                      ? "변경 중..."
                      : isOAuthUser
                        ? "설정"
                        : "변경"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
