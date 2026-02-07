"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingBag,
  ArrowLeft,
  History,
  LogIn,
  User,
  Lock,
  Chrome,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useActivities } from "@/lib/hooks/use-profile";
import { CardListSkeleton } from "@/components/ui/list-skeleton";

const PAGE_SIZE = 5;

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  login: LogIn,
  signup: User,
  google_login: Chrome,
  kakao_login: MessageCircle,
  profile_update: User,
  password_change: Lock,
  mypage_visit: History,
};

const ACTIVITY_LABELS: Record<string, string> = {
  login: "이메일/아이디로 로그인",
  signup: "회원가입",
  google_login: "Google로 로그인",
  kakao_login: "카카오로 로그인",
  profile_update: "프로필 수정",
  password_change: "비밀번호 변경",
  mypage_visit: "마이페이지 최초 방문",
};

export default function ActivitiesPage() {
  const router = useRouter();
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const currentCursor = cursorStack.length > 0 ? cursorStack[cursorStack.length - 1] : undefined;

  const { data: activities, isLoading, error } = useActivities(true, {
    take: PAGE_SIZE + 1,
    cursor: currentCursor,
  });

  const items = activities ?? [];
  const hasNext = items.length > PAGE_SIZE;
  const displayItems = hasNext ? items.slice(0, PAGE_SIZE) : items;
  const nextCursor = hasNext ? displayItems[displayItems.length - 1]?.id : undefined;

  const goNext = () => {
    if (nextCursor) setCursorStack((prev) => [...prev, nextCursor]);
  };
  const goPrev = () => {
    setCursorStack((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (!isLoading && error) {
      router.replace("/login");
    }
  }, [isLoading, error, router]);

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
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-yellow-400 hover:opacity-90 transition-opacity">
              <ShoppingBag className="h-5 w-5 text-black" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">내 활동 기록</h1>
              <p className="text-xs text-zinc-400">계정 활동 내역</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="border-b border-zinc-800">
            <CardTitle className="text-lg font-bold text-lime-400 flex items-center gap-2">
              <History className="h-5 w-5" />
              활동 내역
            </CardTitle>
            <p className="text-sm text-zinc-500 mt-1">
              로그인, 프로필 수정, 비밀번호 변경 등 계정 활동이 기록됩니다.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoading ? (
              <CardListSkeleton itemCount={5} />
            ) : displayItems.length > 0 ? (
              <>
                <div className="space-y-0">
                  {displayItems.map((activity) => {
                  const Icon =
                    ACTIVITY_ICONS[activity.type] ?? History;
                  const label =
                    activity.description ??
                    ACTIVITY_LABELS[activity.type] ??
                    activity.type;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 py-4 border-b border-zinc-800 last:border-0"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-800 border border-zinc-700">
                        <Icon className="h-6 w-6 text-lime-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium">{label}</p>
                        <p className="text-sm text-zinc-500 mt-0.5">
                          {formatActivityDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                  })}
                </div>
                {(cursorStack.length > 0 || hasNext) && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-800">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                      onClick={goPrev}
                      disabled={cursorStack.length === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      이전
                    </Button>
                    <span className="text-sm text-zinc-500">
                      {cursorStack.length + 1}페이지
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-lime-400/20 border-lime-400/50 text-lime-400"
                      onClick={goNext}
                      disabled={!hasNext}
                    >
                      다음
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-16 text-center">
                <History className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500">아직 활동 기록이 없습니다.</p>
                <p className="text-sm text-zinc-600 mt-1">
                  로그인, 프로필 수정 등 활동이 기록됩니다.
                </p>
              </div>
            )}
            <div className="mt-6 pt-6 border-t border-zinc-800">
              <Link href="/mypage?section=history">
                <Button
                  variant="outline"
                  className="w-full bg-lime-400/20 border-lime-400/50 text-lime-400 hover:bg-lime-400/30 hover:text-lime-300 font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  뒤로가기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
