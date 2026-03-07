"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  MapPin,
  Clock,
  ShoppingBag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Share2,
  MessageCircle,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useProduct, useRelatedProducts, useDeleteProduct, useRecordProductView, useToggleProductLike, useWishlist } from "@/lib/hooks/use-products";
import { getImageSrc } from "@/lib/api/sales";
import { ProductImage } from "@/components/ui/product-image";
import { useMe } from "@/lib/hooks/use-me";

function formatPrice(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

const EMPTY_WISHLIST: { id: string }[] = [];

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

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { data: me } = useMe();
  const { data: product, isLoading, error } = useProduct(id);
  const { data: relatedProducts = [] } = useRelatedProducts(id);
  const { data: wishlist } = useWishlist(!!me);
  const deleteMutation = useDeleteProduct();
  const recordViewMutation = useRecordProductView();
  const toggleLikeMutation = useToggleProductLike();

  const images =
    product?.images?.length && product.images.length > 0
      ? product.images.map((u) => getImageSrc(u))
      : ["/images/products/placeholder.svg"];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wishlistData = wishlist ?? EMPTY_WISHLIST;
  const wishlistIds = new Set(wishlistData.map((p) => p.id));
  const [likedIds, setLikedIds] = useState<Set<string>>(wishlistIds);

  useEffect(() => {
    setLikedIds(new Set(wishlistData.map((p) => p.id)));
  }, [wishlistData]);

  useEffect(() => {
    if (me && product) {
      recordViewMutation.mutate(id);
    }
  }, [me, product, id]);

  const isSeller =
    me &&
    product &&
    String(product.sellerId) === String(me.sub);

  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => router.push("/"),
      onError: (err: Error & { info?: { message?: string } }) =>
        alert(err?.info?.message ?? err?.message ?? "삭제에 실패했습니다."),
    });
  };

  const mainImage = images[selectedIndex] ?? images[0];

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">
          {error ? "상품을 찾을 수 없습니다." : "로딩 중..."}
        </p>
      </div>
    );
  }

  const toggleLike = async (productId: string) => {
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
  const hasMultipleImages = images.length > 1;

  const goPrev = () =>
    setSelectedIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  const goNext = () =>
    setSelectedIndex((i) => (i >= images.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1" />
            {isSeller && (
              <>
                <Button variant="ghost" size="icon" asChild className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                  <Link href={`/products/${id}/edit`} aria-label="수정">
                    <Edit3 className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  aria-label="삭제"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={`transition-colors ${
                likedIds.has(id)
                  ? "text-lime-400 hover:text-lime-300 hover:bg-zinc-800"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800"
              }`}
              onClick={() => toggleLike(id)}
              aria-label="좋아요"
            >
              <Heart
                className={`h-5 w-5 ${likedIds.has(id) ? "fill-lime-400" : ""}`}
              />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto_auto] gap-x-8 gap-y-6 mb-12">
          <div className="lg:row-start-1">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 group">
              <ProductImage
                src={mainImage}
                alt={product.title}
                className="h-full w-full object-cover"
              />
              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white transition-opacity group-hover:opacity-100 opacity-90 z-10"
                    aria-label="이전 이미지"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white transition-opacity group-hover:opacity-100 opacity-90 z-10"
                    aria-label="다음 이미지"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.slice(0, 5).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === selectedIndex
                            ? "w-4 bg-white"
                            : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                    {images.length > 5 && (
                      <span className="text-xs text-white/80 ml-1">
                        +{images.length - 5}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="lg:row-start-1 flex flex-col min-h-0">
            <div className="flex-1 flex flex-col min-h-0 overflow-auto">
              <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.condition && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {product.condition}
                  </span>
                )}
                {(product.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 text-zinc-400 border border-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6">
                {product.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeAgo(product.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>조회 {product.views}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold bg-gradient-to-r from-lime-400 to-yellow-400 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-zinc-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-zinc-400">
                  약{" "}
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % 할인
                </p>
              )}
            </div>

            {product.description && (
              <div className="border-t border-zinc-800 pt-6 pb-6 min-h-[200px]">
                <h3 className="text-lg font-semibold text-white mb-4">상품 설명</h3>
                <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <Card className="border border-zinc-800 bg-zinc-900/50 mt-auto shrink-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white">
                  판매자 정보
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-xl border border-zinc-700">
                      👤
                    </div>
                    <div>
                      <span className="font-semibold text-white">
                        판매자 ({product.sellerId.slice(0, 8)}...)
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                  >
                    프로필 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
              </div>
            </div>
          </div>
          <div className="lg:row-start-2 flex gap-2 overflow-x-auto pb-1">
            {images.slice(0, 6).map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative aspect-square w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === selectedIndex
                    ? "border-lime-400"
                    : "border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <ProductImage
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="lg:row-start-2 space-y-4">
            {!isSeller && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 hover:border-zinc-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  채팅하기
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 smooth-shadow-lg shadow-lime-400/30 hover:shadow-lime-400/50 font-semibold">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  구매하기
                </Button>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">관련 상품</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/${item.id}`}>
                  <Card className="group overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 smooth-shadow hover:smooth-shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-xl">
                    <div className="relative aspect-[4/3] w-full bg-zinc-950 overflow-hidden rounded-t-xl">
                      <ProductImage
                        src={getImageSrc(item.image)}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-3 h-9 w-9 rounded-full bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800 smooth-shadow-lg hover:scale-110 transition-all duration-300 border border-zinc-700 z-10"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleLike(item.id);
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 transition-all ${
                            likedIds.has(item.id)
                              ? "fill-lime-400 text-lime-400"
                              : "text-zinc-400 group-hover:fill-lime-400 group-hover:text-lime-400"
                          }`}
                        />
                      </Button>
                    </div>
                    <CardHeader className="pb-2 px-4 pt-4">
                      <CardTitle className="line-clamp-2 text-base font-bold text-white group-hover:text-lime-400 transition-colors duration-300">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2 px-4">
                      <p className="text-xl font-bold bg-gradient-to-r from-lime-400 to-yellow-400 bg-clip-text text-transparent">
                        {formatPrice(item.price)}
                      </p>
                    </CardContent>
                    <CardContent className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800 px-4 pb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{item.location ?? "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-3.5 w-3.5" />
                        {item.likes}
                        <Clock className="h-3.5 w-3.5" />
                        {formatTimeAgo(item.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
