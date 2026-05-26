import { apiClient } from "@shared/api/client";
import { unwrap } from "@shared/api/unwrap";
import type { Envelope } from "@shared/api/envelope";
import type { CustPhoneMask, OtpRequestPayload, OtpVerifyPayload } from "../types";

export async function requestOtp(payload: OtpRequestPayload): Promise<void> {
  const { data } = await apiClient.post<Envelope<null>>(
    "/auth/otp/request",
    payload,
  );
  unwrap(data);
}

export async function verifyOtp(payload: OtpVerifyPayload): Promise<void> {
  const { data } = await apiClient.post<Envelope<null>>(
    "/auth/otp/verify",
    payload,
  );
  unwrap(data);
}

export async function getMaskedCustPhone(wrkRcpNo: string): Promise<string> {
  const { data } = await apiClient.get<Envelope<CustPhoneMask>>(
    `/auth/phonenum/${wrkRcpNo}`,
  );
  return unwrap(data).custPhoneMask;
}
