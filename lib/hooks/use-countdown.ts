"use client";

import { useEffect, useState } from "react";

const VERIFICATION_EXPIRY_SECONDS = 180; // 3분

/**
 * 3분(180초) 카운트다운 훅.
 * @param active - true일 때 카운트다운 시작, false일 때 리셋
 * @param sentAt - 코드 발송 시각 (ms). 있으면 남은 시간부터 계속, 없으면 3분부터 시작
 * @returns { seconds, formatted, isExpired }
 */
export function useCountdown(active: boolean, sentAt?: number) {
  const getInitialSeconds = () => {
    if (!sentAt || sentAt <= 0) return VERIFICATION_EXPIRY_SECONDS;
    const elapsed = Math.floor((Date.now() - sentAt) / 1000);
    return Math.max(0, VERIFICATION_EXPIRY_SECONDS - elapsed);
  };

  const [seconds, setSeconds] = useState(getInitialSeconds);

  useEffect(() => {
    if (!active) {
      setSeconds(VERIFICATION_EXPIRY_SECONDS);
      return;
    }

    setSeconds(getInitialSeconds());
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, sentAt]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${minutes}:${secs.toString().padStart(2, "0")}`;

  return { seconds, formatted, isExpired: seconds === 0 };
}
