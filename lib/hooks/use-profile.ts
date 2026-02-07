"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetchOptions } from "@/lib/api/config";

export interface Profile {
  id: string;
  username: string;
  email: string;
  name: string;
  googleId: string | null;
  kakaoId: string | null;
  createdAt: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  verificationCode?: string;
}

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: ["profile"],
    enabled,
    queryFn: async (): Promise<Profile> => {
      const res = await fetch("/api/auth/profile", {
        method: "GET",
        credentials: "include",
        ...apiFetchOptions,
      });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
        ...apiFetchOptions,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = Array.isArray(err.message)
          ? err.message[0]
          : err.message ?? "프로필 수정에 실패했습니다.";
        throw new Error(msg);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}

export function useInvalidateActivities() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["activities"] });
}

export function useSendEmailChangeCode() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch("/api/auth/me/send-email-change-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
        ...apiFetchOptions,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = Array.isArray(err.message)
          ? err.message[0]
          : err.message ?? "인증 코드 발송에 실패했습니다.";
        throw new Error(msg);
      }
      return res.json();
    },
  });
}

export function useVerifyEmailChangeCode() {
  return useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      const res = await fetch("/api/auth/me/verify-email-change-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: data.email, code: data.code }),
        ...apiFetchOptions,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = Array.isArray(err.message)
          ? err.message[0]
          : err.message ?? "인증 코드가 올바르지 않거나 만료되었습니다.";
        throw new Error(msg);
      }
      return res.json();
    },
  });
}

export interface ChangePasswordInput {
  currentPassword?: string;
  newPassword: string;
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      const res = await fetch("/api/auth/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
        ...apiFetchOptions,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = Array.isArray(err.message)
          ? err.message[0]
          : err.message ?? "비밀번호 변경에 실패했습니다.";
        throw new Error(msg);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
}

export interface Activity {
  id: string;
  type: string;
  description: string | null;
  createdAt: string;
}

export function useActivities(enabled = true, options?: { take?: number; cursor?: string }) {
  const take = options?.take ?? 50;
  const cursor = options?.cursor;
  const queryKey = ["activities", take, cursor ?? ""] as const;
  return useQuery({
    queryKey,
    enabled,
    queryFn: async (): Promise<Activity[]> => {
      const params = new URLSearchParams({ take: String(take) });
      if (cursor) params.set("cursor", cursor);
      const res = await fetch(`/api/auth/me/activities?${params}`, {
        method: "GET",
        credentials: "include",
        ...apiFetchOptions,
      });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    retry: false,
  });
}

export interface LoginHistoryItem {
  id: string;
  ip: string | null;
  createdAt: string;
}

export function useLoginHistory(enabled = true, options?: { take?: number; cursor?: string }) {
  const take = options?.take ?? 50;
  const cursor = options?.cursor;
  const queryKey = ["login-history", take, cursor ?? ""] as const;
  return useQuery({
    queryKey,
    enabled,
    queryFn: async (): Promise<LoginHistoryItem[]> => {
      const params = new URLSearchParams({ take: String(take) });
      if (cursor) params.set("cursor", cursor);
      const res = await fetch(`/api/auth/me/login-history?${params}`, {
        method: "GET",
        credentials: "include",
        ...apiFetchOptions,
      });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    retry: false,
  });
}
