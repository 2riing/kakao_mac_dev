import { WRK_RCP_NO_REGEX } from "./regex";

export function isValidWrkRcpNo(value: string): boolean {
  return WRK_RCP_NO_REGEX.test(value);
}
