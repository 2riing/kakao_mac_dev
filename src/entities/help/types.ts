/* help 도메인 타입 — 조치방법 안내 정적 콘텐츠. */

export type ProductKey = "internet" | "tv" | "phone";

export interface HelpStep {
  id: string;
  title: string;
  description: string;
  link?: { label: string; href: string };
}

export interface HelpProduct {
  key: ProductKey;
  label: string;
  intro: string;
  steps: HelpStep[];
}
