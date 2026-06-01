import { useSearchParams } from "react-router";

export interface KakaoEntryParams {
  wrkRcpNo: string | null;
  reservationDate: string | null;
  channel: string | null;
}

export function useKakaoEntryParams(): KakaoEntryParams {
  const [params] = useSearchParams();
  return {
    wrkRcpNo: params.get("wrkRcpNo"),
    reservationDate: params.get("reservationDate"),
    channel: params.get("channel"),
  };
}
