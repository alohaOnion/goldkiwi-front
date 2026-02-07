import { defineConfig } from "orval";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// 1) openapi.json (프로젝트 루트 또는 auth 형제 폴더) - orval v8은 상대 경로만 지원
// 2) API_SPEC_URL 환경변수
// 3) auth 서버 URL (서버 실행 중이어야 함, PORT=3001 권장)
const localPaths: string[] = [
  resolve(process.cwd(), "openapi.json"),
  resolve(process.cwd(), "../goldkiwi-auth/openapi.json"),
];
const localPath = localPaths.find((p) => existsSync(p));
// Orval v8: 절대 경로 사용 권장 (상대 경로 시 "Failed to resolve input" 발생 가능)
const apiSpecUrl = localPath
  ? localPath
  : process.env.API_SPEC_URL ?? "http://localhost:3001/api-json";

// /api 프록시 사용 (Next.js rewrites) - same-origin으로 쿠키 자동 전송
const clientBaseUrl = "/api";

export default defineConfig({
  goldkiwi: {
    input: { target: apiSpecUrl },
    output: {
      target: "./lib/api/goldkiwi.ts",
      schemas: "./lib/api/model",
      client: "react-query",
      httpClient: "fetch",
      baseUrl: clientBaseUrl,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
          forceSuccessResponse: true,
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
