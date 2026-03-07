"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { ArrowLeft, Plus, ShoppingBag, X } from "lucide-react";
import { useProduct, useUpdateProduct } from "@/lib/hooks/use-products";
import { useMe } from "@/lib/hooks/use-me";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: me } = useMe();
  const { data: product, isLoading, error } = useProduct(id);
  const updateMutation = useUpdateProduct(id);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [condition, setCondition] = useState("중고");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [tagsInput, setTagsInput] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setPrice(String(product.price));
      setOriginalPrice(product.originalPrice ? String(product.originalPrice) : "");
      setCondition(product.condition ?? "중고");
      setDescription(product.description ?? "");
      setLocation(product.location ?? "");
      setIsNew("isNew" in product ? !!product.isNew : true);
      setImageUrls(
        product.images?.length ? product.images : [""]
      );
      setTagsInput(product.tags?.join(", ") ?? "");
    }
  }, [product]);

  const addImageUrl = () => setImageUrls((prev) => [...prev, ""]);
  const removeImageUrl = (i: number) =>
    setImageUrls((prev) => prev.filter((_, idx) => idx !== i));
  const updateImageUrl = (i: number, v: string) =>
    setImageUrls((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const priceNum = parseInt(price.replace(/,/g, ""), 10);
    if (isNaN(priceNum) || priceNum < 0) {
      setMessage({ type: "error", text: "가격을 올바르게 입력해주세요." });
      return;
    }
    const originalNum = originalPrice
      ? parseInt(originalPrice.replace(/,/g, ""), 10)
      : undefined;
    const images = imageUrls.filter(Boolean);
    const tags = tagsInput
      .split(/[,，\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    updateMutation.mutate(
      {
        title: title.trim(),
        price: priceNum,
        originalPrice: originalNum && !isNaN(originalNum) ? originalNum : undefined,
        condition: condition.trim() || undefined,
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        isNew,
        images: images.length ? images : undefined,
        tags: tags.length ? tags : undefined,
      },
      {
        onSuccess: () => {
          setMessage({ type: "success", text: "수정되었습니다." });
          setTimeout(() => router.push(`/${id}`), 800);
        },
        onError: (err: Error & { info?: { message?: string } }) => {
          setMessage({
            type: "error",
            text: err?.info?.message ?? err?.message ?? "수정에 실패했습니다.",
          });
        },
      }
    );
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400">로딩 중...</p>
      </div>
    );
  }

  if (error || product.sellerId !== me?.sub) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950 flex items-center justify-center">
        <Card className="border border-zinc-800 bg-zinc-900/50 max-w-md">
          <CardContent className="pt-8 pb-8 text-center">
            <p className="text-zinc-400 mb-4">
              수정 권한이 없거나 상품을 찾을 수 없습니다.
            </p>
            <Button asChild>
              <Link href="/">홈으로</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={`/${id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-lime-400" />
            상품 수정
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              상품 정보를 수정해주세요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {message && (
                <Alert
                  variant={message.type === "error" ? "destructive" : "default"}
                  className={
                    message.type === "success"
                      ? "border-lime-500/50 bg-lime-500/10 text-lime-400"
                      : ""
                  }
                >
                  {message.text}
                </Alert>
              )}

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  상품명 *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 아이폰 14 Pro Max 256GB"
                  className="bg-zinc-900 border-zinc-800 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    가격 (원) *
                  </label>
                  <Input
                    type="text"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="850000"
                    className="bg-zinc-900 border-zinc-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    정가 (원, 선택)
                  </label>
                  <Input
                    type="text"
                    value={originalPrice}
                    onChange={(e) =>
                      setOriginalPrice(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="1200000"
                    className="bg-zinc-900 border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    상태
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full h-10 px-3 rounded-md bg-zinc-900 border border-zinc-800 text-white"
                  >
                    <option value="새상품">새상품</option>
                    <option value="중고">중고</option>
                    <option value="미개봉">미개봉</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="rounded border-zinc-600"
                    />
                    신상품 표시
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  거래 지역
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="예: 서울시 강남구"
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  상품 설명
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="상품 상태, 포함 품목 등을 자세히 작성해주세요."
                  rows={5}
                  className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-zinc-300">
                    이미지 URL
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 hover:text-white"
                    onClick={addImageUrl}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => updateImageUrl(i, e.target.value)}
                        placeholder="https://..."
                        className="bg-zinc-900 border-zinc-800 text-white"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 shrink-0"
                        onClick={() => removeImageUrl(i)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  태그 (쉼표로 구분)
                </label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="전자제품, 스마트폰, 애플"
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-zinc-800 text-zinc-300"
                  asChild
                >
                  <Link href={`/${id}`}>취소</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-lime-400 to-yellow-400 text-black hover:from-lime-500 hover:to-yellow-500 font-semibold"
                >
                  {updateMutation.isPending ? "수정 중..." : "수정 완료"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
