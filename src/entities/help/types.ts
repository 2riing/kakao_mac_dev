/* help 도메인 타입 — 조치방법 안내 정적 콘텐츠. */

export type ProductKey = "internet" | "tv" | "phone";

export interface HelpStep {
  id: string;
  title: string;
  description: string;
  link?: { label: string; href: string };
}

/* FAQ 정본(help-faq.json) — 전화 탭처럼 소제목(section) 구분이 필요한 구조.
 * title 없는 section은 단일 그룹(인터넷·TV). */
export interface HelpSection {
  title?: string;
  items: HelpStep[];
}

export interface HelpFaqProduct {
  key: ProductKey;
  label: string;
  intro: string;
  sections: HelpSection[];
}
