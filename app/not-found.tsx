import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-500 mb-8">
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
