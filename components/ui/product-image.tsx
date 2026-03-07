"use client";

import { useState } from "react";

const PLACEHOLDER = "/images/products/placeholder.svg";

interface ProductImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined;
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
