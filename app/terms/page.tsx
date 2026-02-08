"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-zinc-950/60 supports-[backdrop-filter]:backdrop-blur-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-300 hover:text-white hover:bg-zinc-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lime-400 to-yellow-400 smooth-shadow-lg shadow-lime-400/20 hover:opacity-90 transition-opacity">
                <ShoppingBag className="h-5 w-5 text-black" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">골드키위</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm smooth-shadow-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white">
                이용약관
              </CardTitle>
              <p className="text-zinc-400 text-sm">
                시행일: 2025년 1월 1일
              </p>
            </CardHeader>
            <CardContent className="space-y-8 text-zinc-300 text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제1조 (목적)
                </h2>
                <p>
                  본 약관은 골드키위(이하 &quot;서비스&quot;)가 제공하는 인터넷 기반 중고거래 플랫폼 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제2조 (정의)
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>&quot;서비스&quot;란 회사가 제공하는 모든 서비스를 의미합니다.</li>
                  <li>&quot;이용자&quot;란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                  <li>&quot;회원&quot;이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
                  <li>&quot;콘텐츠&quot;란 정보통신망법의 규정에 따라 정보통신망에서 사용되는 부호·문자·음성·음향·이미지 또는 영상 등으로 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을 말합니다.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제3조 (약관의 효력 및 변경)
                </h2>
                <p className="mb-2">
                  본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다. 회사는 필요한 경우 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경 시 변경 내용을 서비스 내 공지사항 등을 통해 공지합니다. 변경된 약관은 공지 후 7일이 경과한 후부터 효력이 발생합니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제4조 (서비스의 제공)
                </h2>
                <p>
                  회사는 다음과 같은 서비스를 제공합니다: 중고물품 거래 중개 서비스, 회원 간 거래 정보 제공, 안전거래 서비스, 기타 회사가 추가 개발하거나 제휴계약 등을 통해 이용자에게 제공하는 일체의 서비스.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제5조 (서비스 이용)
                </h2>
                <p className="mb-2">
                  이용자는 서비스를 이용할 때 다음 각 호의 행위를 하여서는 안 됩니다.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                  <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                  <li>외설 또는 폭력적인 메시지, 기타 공서양속에 반하는 정보를 공개 또는 게시하는 행위</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제6조 (회원탈퇴 및 자격 상실)
                </h2>
                <p>
                  회원은 언제든지 서비스 내 회원탈퇴 기능을 통해 이용계약을 해지할 수 있습니다. 회사는 회원이 본 약관을 위반한 경우 별도의 통지 없이 이용계약을 해지하거나 회원 자격을 제한할 수 있습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제7조 (면책조항)
                </h2>
                <p>
                  회사는 이용자 간 또는 이용자와 제3자 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해를 배상할 책임을 지지 않습니다. 회사는 천재지변, 전쟁, 기타 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제8조 (준거법 및 관할)
                </h2>
                <p>
                  본 약관의 해석 및 회사와 이용자 간의 분쟁에 대하여는 대한민국의 법률을 적용하며, 회사와 이용자 간 발생한 분쟁에 관한 소송은 대한민국 법원에 제기합니다.
                </p>
              </section>

              <div className="pt-6 border-t border-zinc-800 text-center">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    로그인으로 돌아가기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
