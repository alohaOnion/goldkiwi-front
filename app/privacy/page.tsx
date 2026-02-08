"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
                개인정보처리방침
              </CardTitle>
              <p className="text-zinc-400 text-sm">
                시행일: 2025년 1월 1일
              </p>
            </CardHeader>
            <CardContent className="space-y-8 text-zinc-300 text-sm leading-relaxed">
              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제1조 (개인정보의 수집 및 이용 목적)
                </h2>
                <p>
                  골드키위(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>회원 가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공, 본인 확인, 부정이용 방지</li>
                  <li>서비스 제공: 중고거래 중개, 구매 및 판매 지원, 콘텐츠 제공</li>
                  <li>마케팅 및 광고: 이벤트 및 광고성 정보 제공, 접속 빈도 파악</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제2조 (수집하는 개인정보의 항목)
                </h2>
                <p className="mb-2">회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>필수항목: 아이디, 비밀번호, 이메일주소, 이름</li>
                  <li>선택항목: 연락처, 생년월일</li>
                  <li>자동 수집 항목: IP주소, 쿠키, 서비스 이용 기록, 접속 로그</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제3조 (개인정보의 보유 및 이용 기간)
                </h2>
                <p>
                  회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 회원 탈퇴 시 즉시 파기하며, 관계 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제4조 (개인정보의 제3자 제공)
                </h2>
                <p>
                  회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 이용자가 사전에 동의한 경우 또는 법령의 규정에 의한 경우는 예외로 합니다. 예를 들어 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우에 한합니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제5조 (개인정보처리 위탁)
                </h2>
                <p>
                  회사는 원활한 서비스 제공을 위해 개인정보 처리업무를 외부에 위탁할 수 있습니다. 위탁업무 시 개인정보 보호법에 따라 위탁업무 수행 목적 외 개인정보 처리 금지, 기술적·관리적 보호조치 등 필요한 사항을 문서로 명시하고, 수탁자가 준수하도록 관리·감독합니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제6조 (정보주체의 권리·의무 및 행사방법)
                </h2>
                <p>
                  이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다: 개인정보 열람 요구, 오류 등이 있을 경우 정정 요구, 삭제 요구, 처리정지 요구. 권리 행사는 회사에 서면, 전화, 전자우편 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제7조 (개인정보의 파기)
                </h2>
                <p>
                  회사는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 복구 및 재생이 되지 않도록 기술적 방법을 이용하여 안전하게 파기하며,종이 문서에 기록된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제8조 (개인정보의 안전성 확보 조치)
                </h2>
                <p>
                  회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다: 개인정보 취급 직원의 최소화 및 교육, 개인정보에 대한 접근 제한, 개인정보의 암호화, 해킹 등에 대비한 기술적 대책, 접속기록의 보관 및 위변조 방지.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제9조 (개인정보 보호책임자)
                </h2>
                <p>
                  회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다. 문의사항이 있으시면 아래 연락처로 연락해 주시기 바랍니다.
                </p>
                <div className="mt-3 p-4 rounded-lg bg-zinc-800/50 text-zinc-400">
                  <p>개인정보 보호책임자</p>
                  <p>이메일: privacy@goldkiwi.com</p>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-white mb-3">
                  제10조 (방침의 변경)
                </h2>
                <p>
                  본 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
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
