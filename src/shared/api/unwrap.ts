import { RESULT_CODE_OK, type Envelope } from "./envelope";

export class ApiError extends Error {
  resultCode: number;

  constructor(resultCode: number, message: string) {
    super(message);
    this.resultCode = resultCode;
    this.name = "ApiError";
  }
}

export function unwrap<T>(envelope: Envelope<T>): T {
  if (envelope.resultCode !== RESULT_CODE_OK) {
    throw new ApiError(envelope.resultCode, envelope.resultMessage);
  }
  return envelope.data;
}
