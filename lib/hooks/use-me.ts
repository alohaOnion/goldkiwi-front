"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetchOptions } from "@/lib/api/config";

export interface MeUser {
  sub: string;
  email?: string;
  username?: string;
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<MeUser> => {
      const res = await fetch("/api/auth/me", {
        method: "POST",
        credentials: "include",
        ...apiFetchOptions,
      });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    retry: false,
  });
}

export function useInvalidateMe() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["me"] });
}
