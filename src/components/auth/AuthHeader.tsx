import KTLogo from "@shared/ui/KTLogo";

// 본인인증 화면 상단 로고 헤더 (다른 화면의 PageHeader와 달리 로고형).
function AuthHeader() {
  return (
    <div className="h-[72px] bg-white flex flex-col items-center justify-center gap-0.5 px-3.5 border-b border-kt-border shrink-0">
      <KTLogo />
    </div>
  );
}

export default AuthHeader;
