import { DAY_NAMES_KO } from "./calendar";

export function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
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
