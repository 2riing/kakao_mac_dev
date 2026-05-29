import Spinner from "./Spinner";

// ScreenContainer 본문 자리를 채우는 전체 영역 로딩. flex-1로 부모 높이를 채움.
function LoadingView() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Spinner color="red" size="lg" />
    </div>
  );
}

export default LoadingView;
