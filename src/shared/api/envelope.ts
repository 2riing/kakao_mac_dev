export interface Envelope<T> {
  resultCode: string;
  resultMessage: string;
  data: T;
}

export const RESULT_CODE_OK = "0000";
