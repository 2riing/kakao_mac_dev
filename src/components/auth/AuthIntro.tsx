// 본인인증 화면 인트로 — 제목 + 안내 문구.
function AuthIntro() {
  return (
    <div className="mb-6">
      <div className="text-[21px] font-bold text-kt-ink mb-1.5">본인인증</div>
      <div className="text-[14px] text-kt-gray-500 leading-[1.65]">
        예약 확인을 위해 본인인증이 필요합니다.
      </div>
    </div>
  );
}

export default AuthIntro;
