"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  MapPin,
  Clock,
  ShoppingBag,
  ArrowLeft,
  Share2,
  MessageCircle,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProduct, useRelatedProducts, useDeleteProduct } from "@/lib/hooks/use-products";
import { useMe } from "@/lib/hooks/use-me";

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

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = params.id;
  const { data: me } = useMe();
  const { data: product, isLoading, error } = useProduct(id);
  const { data: relatedProducts = [] } = useRelatedProducts(id);
  const deleteMutation = useDeleteProduct();

  const isSeller = me && product && product.sellerId === me.sub;

  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => router.push("/"),
      onError: (err: Error & { info?: { message?: string } }) =>
        alert(err?.info?.message ?? err?.message ?? "삭제에 실패했습니다."),
    });
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">
          {error ? "상품을 찾을 수 없습니다." : "로딩 중..."}
        </p>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : ["/images/products/product1.jpg"];
  const mainImage = images[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
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
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/products/${id}/edit`}>
                    <Edit3 className="h-4 w-4 mr-1" />
                    수정
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  삭제
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
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors"
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

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

            <Card className="border border-zinc-800 bg-zinc-900/50">
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

        {product.description && (
          <Card className="border border-zinc-800 bg-zinc-900/50 mb-12">
            <CardHeader>
              <CardTitle className="text-xl text-white">상품 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>
        )}

        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">관련 상품</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProducts.map((item) => (
                <Link key={item.id} href={`/${item.id}`}>
                  <Card className="group overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 smooth-shadow hover:smooth-shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-xl">
                    <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden rounded-t-xl">
                      <Image
                        src={
                          item.image ?? "/images/products/product1.jpg"
                        }
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-3 h-9 w-9 rounded-full bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800 smooth-shadow-lg hover:scale-110 transition-all duration-300 border border-zinc-700"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="h-4 w-4 text-zinc-400 group-hover:fill-lime-400 group-hover:text-lime-400 transition-all" />
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
