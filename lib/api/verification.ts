/**
 * 이메일 인증 관련 API (회원가입, 비밀번호 찾기)
 * - OpenAPI 재생성 전까지 직접 fetch 사용
 */
import { apiFetchOptions } from "./config";

const API_BASE =
  typeof window !== "undefined" ? "/api" : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type SendVerificationPayload = {
  email: string;
  purpose: "signup" | "password_reset";
};

export async function sendVerificationCode(
  payload: SendVerificationPayload
): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/auth/send-verification-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    ...apiFetchOptions,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message ?? "인증 코드 발송에 실패했습니다.") as Error & {
      info?: unknown;
      status?: number;
    };
    err.info = data;
    err.status = res.status;
    throw err;
  }
  return data;
}

export type SignupWithVerificationPayload = {
  username: string;
  email: string;
  password: string;
  name: string;
  verificationCode: string;
};

export async function signupWithVerification(
  payload: SignupWithVerificationPayload
): Promise<{ id: string; username: string; email: string; name: string }> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    ...apiFetchOptions,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message ?? "회원가입에 실패했습니다.") as Error & {
      info?: unknown;
      status?: number;
    };
    err.info = data;
    err.status = res.status;
    throw err;
  }
  return data;
}

export type ResetPasswordPayload = {
  email: string;
  verificationCode: string;
  newPassword: string;
};

export async function resetPassword(
  payload: ResetPasswordPayload
): Promise<{ ok: boolean }> {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    ...apiFetchOptions,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message ?? "비밀번호 재설정에 실패했습니다.") as Error & {
      info?: unknown;
      status?: number;
    };
    err.info = data;
    err.status = res.status;
    throw err;
  }
  return data;
}
