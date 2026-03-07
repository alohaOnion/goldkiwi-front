"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Clock, Search, X } from "lucide-react";
import { useProducts, useToggleProductLike, useWishlist } from "@/lib/hooks/use-products";
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
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const { data: me } = useMe();
  const { data: wishlist = [] } = useWishlist(!!me);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const toggleLikeMutation = useToggleProductLike();

  useEffect(() => {
    setLikedIds(new Set((wishlist ?? []).map((p) => p.id)));
  }, [wishlist]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const toggleLike = (productId: string) => {
    if (me) {
      toggleLikeMutation.mutate(productId, {
        onSuccess: (data) => {
          setLikedIds((prev) => {
            const next = new Set(prev);
            if (data.liked) next.add(productId);
            else next.delete(productId);
            return next;
          });
        },
      });
    } else {
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
      });
    }
  };
  const { data, isLoading } = useProducts({
    page,
    limit: 12,
    q: search || undefined,
  });
  const products = data?.items ?? [];
  const hasMore = data?.hasMore ?? false;
  const hasSearch = !!search;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      <MainHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">상품 목록</h2>
          <p className="text-zinc-400 mb-6">
            전체 상품을 확인해보세요
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 pointer-events-none" />
            <Input
              type="search"
              placeholder="상품명, 설명으로 검색..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-12 pr-12 h-12 rounded-xl border-zinc-800 bg-zinc-900/80 text-white placeholder:text-zinc-500 focus-visible:ring-lime-400/50 focus-visible:border-lime-400/50 focus-visible:bg-zinc-900 transition-all duration-200"
              aria-label="상품 검색"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="검색어 지우기"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <ProductCardGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            {hasSearch ? "검색 결과가 없습니다." : "등록된 상품이 없습니다."}
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
                    <div className="relative aspect-[4/3] w-full bg-zinc-950 overflow-hidden rounded-t-xl">
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
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-3 h-9 w-9 rounded-full bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800 smooth-shadow-lg hover:scale-110 transition-all duration-300 border border-zinc-700 z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(product.id);
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 transition-all ${
                            likedIds.has(product.id)
                              ? "fill-lime-400 text-lime-400"
                              : "text-zinc-400 group-hover:fill-lime-400 group-hover:text-lime-400"
                          }`}
                        />
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
