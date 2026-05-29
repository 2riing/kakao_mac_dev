// 한국 요일 약자. Date.getDay() 인덱스(일=0)와 매칭.
export const DAY_NAMES_KO = ["일", "월", "화", "수", "목", "금", "토"] as const;

// 작업접수번호: "1O" + YYYYMMDD(8) + 16진수 일련번호(5, 0-9A-F) = 15자 (예: 1O2026082012345, 1O20260820ABCDE)
export const WRK_RCP_NO_REGEX = /^1O\d{8}[0-9A-F]{5}$/;
// 경로·문자열 내 검색용 (anchor 없음) — 라우트 구조 무관하게 wrkRcpNo 추출
export const WRK_RCP_NO_PATTERN = /1O\d{8}[0-9A-F]{5}/;

export function toTwoDigits(n: number): string {
  return String(n).padStart(2, "0");
}

// (y, m, d) → "YYYY-MM-DD"
export function toYmd(y: number, m: number, d: number): string {
  return `${y}-${toTwoDigits(m)}-${toTwoDigits(d)}`;
}

// 로컬 오늘 → "YYYY-MM-DD"
export function todayYmd(): string {
  const n = new Date();
  return toYmd(n.getFullYear(), n.getMonth() + 1, n.getDate());
}

// "YYYY-MM-DD" + days → "YYYY-MM-DD"
export function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toYmd(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
}

// "2026-05-25" → "2026년 5월 25일 (월)"
export function formatVisitDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  const day = DAY_NAMES_KO[new Date(y, m - 1, d).getDay()];
  return `${y}년 ${m}월 ${d}일 (${day})`;
}

// "14:00" → "14:00 ~ 15:00"
// TODO: 백엔드가 시작/끝 시간을 분리해서 주거나 timezone 필드(rsrvTodZn 등) 확정되면 교체
export function formatTimeRange(rsrvTod: string, hours: number = 1): string {
  const [hh, mm] = rsrvTod.split(":").map(Number);
  if (isNaN(hh) || isNaN(mm)) return rsrvTod;
  const endHh = String((hh + hours) % 24).padStart(2, "0");
  const mmStr = String(mm).padStart(2, "0");
  return `${rsrvTod} ~ ${endHh}:${mmStr}`;
}
