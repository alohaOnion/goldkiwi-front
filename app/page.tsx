"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Heart,
  MapPin,
  Clock,
  ShoppingBag,
  Laptop,
  Shirt,
  Sofa,
  BookOpen,
  Dumbbell,
  MoreHorizontal,
  Sparkles,
  MessageSquare,
  Eye,
  User,
  ArrowRight,
  Trophy,
  Medal,
  Star,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  const categories = [
    {
      name: "전자제품",
      count: 1234,
      icon: Laptop,
      color: "from-blue-400 to-cyan-400",
    },
    {
      name: "의류",
      count: 856,
      icon: Shirt,
      color: "from-pink-400 to-rose-400",
    },
    {
      name: "가구",
      count: 432,
      icon: Sofa,
      color: "from-orange-400 to-amber-400",
    },
    {
      name: "도서",
      count: 321,
      icon: BookOpen,
      color: "from-purple-400 to-violet-400",
    },
    {
      name: "스포츠",
      count: 567,
      icon: Dumbbell,
      color: "from-red-400 to-orange-400",
    },
    {
      name: "기타",
      count: 890,
      icon: MoreHorizontal,
      color: "from-gray-400 to-slate-400",
    },
  ];

  const products = [
    {
      id: 1,
      title: "아이폰 14 Pro Max",
      price: "850,000원",
      location: "서울시 강남구",
      time: "2시간 전",
      image: "/images/products/product1.jpg",
      likes: 23,
      isNew: true,
    },
    {
      id: 2,
      title: "나이키 운동화",
      price: "80,000원",
      location: "서울시 마포구",
      time: "5시간 전",
      image: "/images/products/product2.jpg",
      likes: 15,
      isNew: false,
    },
    {
      id: 3,
      title: "맥북 프로 13인치",
      price: "1,200,000원",
      location: "서울시 서초구",
      time: "1일 전",
      image: "/images/products/product3.jpg",
      likes: 42,
      isNew: true,
    },
    {
      id: 4,
      title: "에어팟 프로 2세대",
      price: "200,000원",
      location: "서울시 송파구",
      time: "3시간 전",
      image: "/images/products/product4.jpg",
      likes: 31,
      isNew: false,
    },
    {
      id: 5,
      title: "책상 의자",
      price: "150,000원",
      location: "서울시 용산구",
      time: "6시간 전",
      image: "/images/products/product5.jpg",
      likes: 8,
      isNew: false,
    },
    {
      id: 6,
      title: "자전거",
      price: "300,000원",
      location: "서울시 종로구",
      time: "1일 전",
      image: "/images/products/product6.jpg",
      likes: 19,
      isNew: true,
    },
    {
      id: 7,
      title: "갤럭시 워치",
      price: "250,000원",
      location: "서울시 영등포구",
      time: "4시간 전",
      image: "/images/products/product2.jpg",
      likes: 27,
      isNew: true,
    },
    {
      id: 8,
      title: "아이패드 에어",
      price: "750,000원",
      location: "서울시 강동구",
      time: "1일 전",
      image: "/images/products/product3.jpg",
      likes: 35,
      isNew: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-zinc-950/60 supports-[backdrop-filter]:backdrop-blur-2xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-yellow-400 smooth-shadow-lg shadow-lime-400/20">
                <ShoppingBag className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">골드키위</h1>
                <p className="text-xs text-zinc-400 font-medium">
                  프리미엄 중고거래
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="font-medium text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                로그인
              </Button>
              <Button className="bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 smooth-shadow-lg shadow-lime-400/30 hover:shadow-lime-400/50 transition-all duration-300 font-semibold">
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900/50 border border-zinc-800 text-zinc-300 text-sm font-semibold smooth-shadow backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-lime-400" />
            <span>새로운 상품이 매일 업데이트됩니다</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-white">
            원하는 상품을
            <br />
            <span className="bg-gradient-to-r from-lime-400 via-yellow-400 to-lime-400 bg-clip-text text-transparent">
              쉽고 빠르게
            </span>
            <br />
            찾아보세요
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            프리미엄 중고거래 플랫폼에서 최고의 상품을 만나보세요
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 group-focus-within:text-lime-400 transition-colors duration-300" />
              <Input
                type="search"
                placeholder="찾고 싶은 상품을 검색해보세요..."
                className="pl-14 h-16 text-base border-2 border-zinc-800 focus:border-lime-400/50 focus:ring-2 focus:ring-lime-400/20 rounded-xl bg-zinc-900/50 backdrop-blur-sm smooth-shadow hover:shadow-md transition-all duration-300 text-white placeholder:text-zinc-500"
              />
            </div>
            <Button
              size="lg"
              className="h-16 px-10 bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 smooth-shadow-lg shadow-lime-400/30 hover:shadow-lime-400/50 rounded-xl transition-all duration-300 font-semibold"
            >
              검색
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">카테고리</h2>
          <p className="text-zinc-400">원하는 카테고리를 선택하세요</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 hover:bg-zinc-900 smooth-shadow hover:smooth-shadow-lg hover:-translate-y-1 transition-all duration-500"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} smooth-shadow-lg group-hover:scale-110 transition-all duration-500`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-center">
                  <span className="block font-semibold text-base mb-1 text-white group-hover:text-lime-400 transition-colors">
                    {category.name}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">
                    {category.count.toLocaleString()}개
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">인기 상품</h2>
            <p className="text-zinc-400">
              지금 가장 인기 있는 상품들을 만나보세요
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl"
          >
            더보기 →
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 smooth-shadow hover:smooth-shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer rounded-xl"
            >
              <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
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
                  {product.price}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800 px-4 pb-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  <span className="font-medium text-xs">
                    {product.location}
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
                    <span className="text-xs">{product.time}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Community Board Preview */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">
              커뮤니티 게시판
            </h2>
            <p className="text-zinc-400">최근 게시글을 확인하고 소통해보세요</p>
          </div>
          <Button
            variant="ghost"
            className="text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl"
          >
            게시판 보기 →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 1,
              title: "아이폰 15 구매 후기 공유합니다!",
              author: "김철수",
              views: 234,
              comments: 12,
              time: "2시간 전",
              category: "후기",
            },
            {
              id: 2,
              title: "중고거래 시 주의사항 알려드려요",
              author: "이영희",
              views: 567,
              comments: 28,
              time: "5시간 전",
              category: "정보",
            },
            {
              id: 3,
              title: "이번 주말에 벼룩시장 열립니다",
              author: "박민수",
              views: 189,
              comments: 5,
              time: "1일 전",
              category: "이벤트",
            },
            {
              id: 4,
              title: "맥북 프로 추천해주세요",
              author: "최지영",
              views: 412,
              comments: 19,
              time: "3시간 전",
              category: "질문",
            },
            {
              id: 5,
              title: "신뢰할 수 있는 판매자 추천받아요",
              author: "정대현",
              views: 678,
              comments: 34,
              time: "6시간 전",
              category: "질문",
            },
            {
              id: 6,
              title: "거래 완료했습니다! 감사합니다",
              author: "한소희",
              views: 123,
              comments: 8,
              time: "1일 전",
              category: "후기",
            },
          ].map((post) => (
            <Card
              key={post.id}
              className="group overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 smooth-shadow hover:smooth-shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-xl"
            >
              <CardHeader className="pb-3 px-5 pt-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {post.category}
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="line-clamp-2 text-base font-bold text-white group-hover:text-lime-400 transition-colors duration-300">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 px-5">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <span>{post.time}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-zinc-800 px-5 pb-5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="font-medium">{post.views}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="font-medium">{post.comments}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* User Ranking */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">유저 랭킹</h2>
            <p className="text-zinc-400">
              이번 달 가장 활발한 유저들을 확인해보세요
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl"
          >
            전체 랭킹 보기 →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 1,
              rank: 1,
              name: "김중고왕",
              score: 1250,
              trades: 45,
              reviews: 32,
              avatar: "👑",
            },
            {
              id: 2,
              rank: 2,
              name: "이거래왕",
              score: 1120,
              trades: 38,
              reviews: 28,
              avatar: "⭐",
            },
            {
              id: 3,
              rank: 3,
              name: "박신뢰",
              score: 980,
              trades: 35,
              reviews: 25,
              avatar: "🏆",
            },
            {
              id: 4,
              rank: 4,
              name: "최안전거래",
              score: 875,
              trades: 32,
              reviews: 22,
              avatar: "💎",
            },
            {
              id: 5,
              rank: 5,
              name: "정우수판매자",
              score: 820,
              trades: 28,
              reviews: 20,
              avatar: "✨",
            },
            {
              id: 6,
              rank: 6,
              name: "한빠른거래",
              score: 765,
              trades: 25,
              reviews: 18,
              avatar: "🚀",
            },
          ].map((user) => (
            <Card
              key={user.id}
              className="group overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 smooth-shadow hover:smooth-shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-xl"
            >
              <CardHeader className="pb-3 px-5 pt-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-3xl border-2 border-zinc-700">
                      {user.avatar}
                    </div>
                    {user.rank <= 3 && (
                      <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-yellow-400 smooth-shadow">
                        {user.rank === 1 ? (
                          <Trophy className="h-3.5 w-3.5 text-black" />
                        ) : user.rank === 2 ? (
                          <Medal className="h-3.5 w-3.5 text-black" />
                        ) : (
                          <Star className="h-3.5 w-3.5 text-black" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-white">
                        {user.name}
                      </span>
                      {user.rank <= 3 && (
                        <TrendingUp className="h-4 w-4 text-lime-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {user.rank}위
                      </span>
                      <span className="text-xs text-zinc-400">
                        {user.score.toLocaleString()}점
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3 px-5">
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="font-medium">거래 {user.trades}회</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="font-medium">후기 {user.reviews}개</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t border-zinc-800 px-5 pb-5">
                <div className="w-full">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-400">활동 점수</span>
                    <span className="font-semibold text-lime-400">
                      {user.score.toLocaleString()}점
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-lime-400 to-yellow-400 transition-all duration-500"
                      style={{
                        width: `${(user.score / 1250) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-14 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-yellow-400 smooth-shadow-lg shadow-lime-400/20">
                <ShoppingBag className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">골드키위</span>
            </div>
            <p className="text-sm text-zinc-500 text-center">
              © 2024 골드키위. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
