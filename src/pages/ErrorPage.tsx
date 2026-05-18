import { Link } from "react-router";

function ErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">오류가 발생했습니다</h1>
        <p className="text-gray-600 mb-6">잠시 후 다시 시도해 주세요.</p>
        <Link to="/login" className="text-kt-red underline">
          로그인으로 돌아가기
        </Link>
      </div>
    </main>
  );
}

export default ErrorPage;
