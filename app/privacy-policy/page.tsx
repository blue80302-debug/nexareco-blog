import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
      <p className="text-sm text-gray-400 mb-12">최종 업데이트: 2026년 6월 23일</p>

      <div className="space-y-10 text-base leading-8 text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            1. 개인정보의 처리 목적
          </h2>
          <p>
            NEXARECO(이하 &ldquo;본 사이트&rdquo;)는 문의하기 폼을 통해 수집된
            개인정보를 이용자의 문의에 답변하기 위한 목적으로만 처리합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            2. 수집하는 개인정보 항목
          </h2>
          <p>본 사이트는 다음의 개인정보를 수집합니다.</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>이메일 주소 (문의하기 이용 시)</li>
            <li>문의 내용</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            3. 개인정보의 보유 및 이용 기간
          </h2>
          <p>
            개인정보는 문의 처리 완료 후 6개월 이내에 파기됩니다. 단, 관계 법령에
            따라 보존할 필요가 있는 경우에는 해당 법령에서 정한 기간 동안
            보존합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            4. 개인정보의 제3자 제공
          </h2>
          <p>
            본 사이트는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            5. 쿠키 및 광고
          </h2>
          <p>
            본 사이트는 Google AdSense를 통해 광고를 게재할 수 있습니다. Google은
            쿠키를 사용하여 사용자의 이전 방문 기록을 기반으로 관련성 높은 광고를
            표시할 수 있습니다. Google의 개인정보 보호 정책은{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-4"
            >
              여기
            </a>
            에서 확인하실 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            6. 개인정보 보호책임자
          </h2>
          <p>
            개인정보 처리에 관한 문의사항은 아래 이메일로 연락 주시기 바랍니다.
          </p>
          <p className="mt-2 text-gray-900 font-medium">blue80302@gmail.com</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            7. 개정 사항
          </h2>
          <p>
            본 개인정보처리방침은 법령 및 서비스 변경에 따라 내용이 변경될 수 있으며,
            변경 시 본 페이지를 통해 공지합니다.
          </p>
        </section>
      </div>
    </div>
  );
}
