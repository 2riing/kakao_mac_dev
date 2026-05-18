import { useSearchParams } from "react-router";

export interface KakaoEntryParams {
  wrkRcpNo: string | null;
  channel: string | null;
}

export function useKakaoEntryParams(): KakaoEntryParams {
  const [params] = useSearchParams();
  return {
    wrkRcpNo: params.get("wrkRcpNo"),
    channel: params.get("channel"),
  };
}
