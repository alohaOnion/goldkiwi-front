/**
 * API 클라이언트 설정
 * - same-origin 요청으로 쿠키 자동 전송 (Next.js rewrites로 /api -> auth 서버 프록시)
 * - credentials: 'include'로 응답 쿠키 수신
 */
export const API_BASE_URL =
  typeof window !== "undefined" ? "/api" : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiFetchOptions: RequestInit = {
  credentials: "include",
};
