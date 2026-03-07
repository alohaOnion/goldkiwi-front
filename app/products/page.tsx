"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, MapPin, Clock } from "lucide-react";
import { useProducts } from "@/lib/hooks/use-products";
import { getImageSrc } from "@/lib/api/sales";
import { ProductImage } from "@/components/ui/product-image";
import { useMe } from "@/lib/hooks/use-me";
import { MainHeader } from "@/components/layout/main-header";
import { ProductCardGridSkeleton } from "@/components/ui/list-skeleton";

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

function formatTimeAgo(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (m < 60) return `${m}분 전`;
  if (h < 24) return `${h}시간 전`;
  if (day < 7) return `${day}일 전`;
  return d.toLocaleDateString("ko-KR");
}

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const { data: me } = useMe();
  const { data, isLoading } = useProducts({ page, limit: 12 });
  const products = data?.items ?? [];
  const hasMore = data?.hasMore ?? false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      <MainHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">상품 목록</h2>
          <p className="text-zinc-400">
            전체 상품을 확인해보세요
          </p>
        </div>

        {isLoading ? (
          <ProductCardGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            등록된 상품이 없습니다.
            {me && (
              <div className="mt-4">
                <Button asChild>
                  <Link href="/products/new">첫 상품 등록하기</Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Link key={product.id} href={`/${product.id}`}>
                  <Card className="group overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 smooth-shadow hover:smooth-shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer rounded-xl">
                    <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden rounded-t-xl">
                      <ProductImage
                        src={getImageSrc(product.image)}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      {product.isNew && (
                        <div className="absolute left-3 top-3 px-3 py-1 rounded-full bg-gradient-to-r from-lime-400 to-yellow-400 text-black text-xs font-bold smooth-shadow-lg shadow-lime-400/30">
                          NEW
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-3 h-9 w-9 rounded-full bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800 smooth-shadow-lg hover:scale-110 transition-all duration-300 border border-zinc-700"
                      >
                        <Heart className="h-4 w-4 text-zinc-400 group-hover:fill-lime-400 group-hover:text-lime-400 transition-all" />
                      </Button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <CardHeader className="pb-2 px-4 pt-4">
                      <CardTitle className="line-clamp-2 text-base font-bold text-white group-hover:text-lime-400 transition-colors duration-300">
                        {product.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 px-4">
                      <p className="text-xl font-bold bg-gradient-to-r from-lime-400 to-yellow-400 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800 px-4 pb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="font-medium text-xs">
                          {product.location ?? "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <Heart className="h-3.5 w-3.5 fill-zinc-600 text-zinc-500" />
                          <span className="font-semibold text-xs">
                            {product.likes}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="text-xs">
                            {formatTimeAgo(product.createdAt)}
                          </span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  className="border-zinc-800 text-zinc-300"
                  onClick={() => setPage((p) => p + 1)}
                >
                  더보기
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
