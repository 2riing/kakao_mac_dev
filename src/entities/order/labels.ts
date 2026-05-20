// spotWrkTypeCd → 사용자 표시명 매핑
// TODO: 백엔드가 svcLctgNm(작업종류명)으로 직접 내려주기로 확정되면 이 매핑 제거
const SPOT_WRK_TYPE_LABEL: Record<string, string> = {
  INSTALL: "인터넷 개통",
  TV_INSTALL: "TV 개통",
  PHONE_INSTALL: "전화 개통",
  AS: "수리",
  MOVE: "이전설치",
};

export function getSpotWrkTypeLabel(cd: string): string {
  return SPOT_WRK_TYPE_LABEL[cd] ?? cd;
}
