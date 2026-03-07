import { NextRequest, NextResponse } from "next/server";

const SALES_URL =
  process.env.NEXT_PUBLIC_SALES_API_URL ?? "http://localhost:3002";

/** 업로드된 이미지를 sales 서버에서 가져와 프록시 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await params;
  if (!path?.length) {
    return new NextResponse("Not Found", { status: 404 });
  }
  const imagePath = path.join("/");
  const url = `${SALES_URL}/${imagePath}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return new NextResponse("Not Found", { status: 404 });
    }
    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
