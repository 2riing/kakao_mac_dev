import { Link } from "react-router";

function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-gray-600 mb-6">페이지를 찾을 수 없습니다.</p>
        <Link to="/login" className="text-kt-red underline">
          로그인으로 이동
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
