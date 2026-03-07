"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, ShoppingBag, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useMe } from "@/lib/hooks/use-me";
import { useProfile } from "@/lib/hooks/use-profile";
import { useAuthControllerLogout } from "@/lib/api/goldkiwi";
import { apiFetchOptions } from "@/lib/api/config";

export function MainHeader() {
  const queryClient = useQueryClient();
  const { data: me, isLoading: isMeLoading } = useMe();
  const { data: profile } = useProfile(!!me);
  const logoutMutation = useAuthControllerLogout({
    mutation: {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["me"] });
        window.location.replace("/");
      },
    },
    fetch: { credentials: "include", ...apiFetchOptions },
  });

  const handleLogout = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID ?? "goldkiwi-front";
    const clientSecret =
      process.env.NEXT_PUBLIC_CLIENT_SECRET ?? "goldkiwi-front-secret-dev";
    logoutMutation.mutate({ data: { clientId, clientSecret } });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-zinc-950/60 supports-[backdrop-filter]:backdrop-blur-2xl">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-yellow-400 smooth-shadow-lg shadow-lime-400/20 hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="h-6 w-6 text-black" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">골드키위</h1>
              <p className="text-xs text-zinc-400 font-medium">
                프리미엄 중고거래
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {me ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
                  asChild
                >
                  <Link href="/products/new">
                    <Plus className="h-4 w-4 mr-1" />
                    상품등록
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
                  asChild
                >
                  <Link href="/mypage">
                    <User className="h-4 w-4 mr-1" />
                    {profile?.name ?? me.username ?? me.email ?? "사용자"}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  로그아웃
                </Button>
              </>
            ) : !isMeLoading ? (
              <>
                <Button
                  variant="ghost"
                  className="font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
                  asChild
                >
                  <Link href="/login">로그인</Link>
                </Button>
                <Button
                  className="bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 smooth-shadow-lg shadow-lime-400/30 hover:shadow-lime-400/50 transition-all duration-300 font-semibold"
                  asChild
                >
                  <Link href="/signup">회원가입</Link>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
