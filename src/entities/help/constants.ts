import type { HelpFaqProduct, ProductKey } from "./types";
import helpFaq from "./help-faq.json";

// FAQ 정본 — HelpPage가 사용하는 데이터. 콘텐츠는 help-faq.json에서 관리.
export const HELP_FAQ = helpFaq as unknown as Record<
  ProductKey,
  HelpFaqProduct
>;

export const PRODUCT_TABS: ReadonlyArray<{ value: ProductKey; label: string }> = [
  { value: "internet", label: "인터넷" },
  { value: "tv", label: "TV" },
  { value: "phone", label: "전화" },
];
