"use client";

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
  Star,
  Shield,
  CheckCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetail({ params }: { params: { id: string } }) {
  // 샘플 상품 데이터
  const product = {
    // id: params.id,
    id: 3,
    title: "아이폰 14 Pro Max 256GB",
    price: "850,000원",
    originalPrice: "1,200,000원",
    condition: "중고",
    description: `아이폰 14 Pro Max 256GB 모델입니다.
    
사용 기간: 약 1년 정도 사용했습니다.
상태: 전면/후면 모두 보호필름 부착되어 있어 깨끗합니다.
포함품: 박스, 충전기, 케이블 모두 포함입니다.
    
배터리 상태: 89% (정상 사용 가능)
기능: 모든 기능 정상 작동합니다.
    
직거래 가능 지역: 서울시 강남구
택배 거래도 가능합니다.`,
    location: "서울시 강남구",
    time: "2시간 전",
    views: 234,
    likes: 23,
    seller: {
      name: "김중고왕",
      rating: 4.8,
      trades: 45,
      verified: true,
    },
    images: [
      "/images/products/product1.jpg",
      "/images/products/product2.jpg",
      "/images/products/product3.jpg",
      "/images/products/product4.jpg",
    ],
    tags: ["전자제품", "스마트폰", "애플", "아이폰"],
  };

  const relatedProducts = [
    {
      id: 2,
      title: "아이폰 13 Pro",
      price: "650,000원",
      image: "/images/products/product2.jpg",
      location: "서울시 마포구",
      time: "5시간 전",
      likes: 15,
    },
    {
      id: 3,
      title: "갤럭시 S23 Ultra",
      price: "950,000원",
      image: "/images/products/product3.jpg",
      location: "서울시 서초구",
      time: "1일 전",
      likes: 42,
    },
    {
      id: 4,
      title: "아이폰 12 Pro Max",
      price: "550,000원",
      image: "/images/products/product4.jpg",
      location: "서울시 송파구",
      time: "3시간 전",
      likes: 31,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-zinc-950/60 supports-[backdrop-filter]:backdrop-blur-2xl">
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
          {/* 이미지 섹션 */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
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

          {/* 상품 정보 */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {product.condition}
                </span>
                {product.tags.map((tag) => (
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
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{product.time}</span>
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
                  {product.price}
                </span>
                <span className="text-lg text-zinc-500 line-through">
                  {product.originalPrice}
                </span>
              </div>
              <p className="text-sm text-zinc-400">
                약 {Math.round((850000 / 1200000) * 100)}% 할인
              </p>
            </div>

            {/* 판매자 정보 */}
            <Card className="border border-zinc-800 bg-zinc-900/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  판매자 정보
                  {product.seller.verified && (
                    <Shield className="h-4 w-4 text-lime-400" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-xl border border-zinc-700">
                      👤
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {product.seller.name}
                        </span>
                        {product.seller.verified && (
                          <CheckCircle className="h-4 w-4 text-lime-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-lime-400 text-lime-400" />
                          <span className="text-sm text-zinc-300">
                            {product.seller.rating}
                          </span>
                        </div>
                        <span className="text-sm text-zinc-500">
                          거래 {product.seller.trades}회
                        </span>
                      </div>
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

            {/* 액션 버튼 */}
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
          </div>
        </div>

        {/* 상품 설명 */}
        <Card className="border border-zinc-800 bg-zinc-900/50 mb-12">
          <CardHeader>
            <CardTitle className="text-xl text-white">상품 설명</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 관련 상품 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">관련 상품</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedProducts.map((item) => (
              <Link key={item.id} href={`/product/${item.id}`}>
                <Card className="group overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 smooth-shadow hover:smooth-shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-xl">
                  <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden rounded-t-xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-3 h-9 w-9 rounded-full bg-zinc-900/80 backdrop-blur-sm hover:bg-zinc-800 smooth-shadow-lg hover:scale-110 transition-all duration-300 border border-zinc-700"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
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
                      {item.price}
                    </p>
                  </CardContent>
                  <CardContent className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800 px-4 pb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                      <span className="font-medium text-xs">
                        {item.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 fill-zinc-600 text-zinc-500" />
                        <span className="font-semibold text-xs">
                          {item.likes}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-xs">{item.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
