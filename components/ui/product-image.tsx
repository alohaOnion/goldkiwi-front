"use client";

import type { ImgHTMLAttributes } from "react";
import { useState } from "react";

const PLACEHOLDER = "/images/products/placeholder.svg";

interface ProductImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
}

/** 이미지 로드 실패 시 placeholder로 한 번만 fallback */
export function ProductImage({
  src,
  alt,
  className,
  ...props
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const displaySrc = failed || !src ? PLACEHOLDER : src;

  return (
    <img
      {...props}
      src={displaySrc}
      alt={alt ?? ""}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
