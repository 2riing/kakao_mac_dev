import type { HelpProduct, ProductKey } from "./types";

// 상품별 조치방법 안내 콘텐츠. 정적 — 백엔드 미연동.
export const HELP_DATA: Record<ProductKey, HelpProduct> = {
  internet: {
    key: "internet",
    label: "인터넷",
    intro: "인터넷이 평소와 다르신가요?",
    steps: [
      {
        id: "i1",
        title: "인터넷이 안돼요.",
        description:
          "먼저 인터넷 랜케이블이 양쪽 모두 단단히 꽂혀 있는지 살펴봐 주세요. 이 부분에서 원인이 발견되는 경우가 많습니다.",
      },
      {
        id: "i2",
        title: "인터넷이 자주 끊겨요.",
        description:
          "모뎀이나 공유기의 전원을 잠시 끄셨다가 10초 뒤에 다시 켜보세요. 일시적인 끊김은 이 방법으로 해소되는 경우가 많습니다.",
      },
      {
        id: "i3",
        title: "인터넷 속도가 갑자기 느려졌어요.",
        description:
          "먼저 인터넷 속도를 측정해 보세요. 회선 속도가 정상이라면 PC의 바이러스나 백그라운드 프로그램이 원인일 수 있으니 함께 점검해 보세요.",
      },
      {
        id: "i4",
        title: "인터넷 속도는 어디서 측정하나요?",
        description:
          "kt.com 의 [고객지원 > 서비스 이용안내 > 인터넷 속도측정] 메뉴에서 측정해 보실 수 있어요.",
      },
      {
        id: "i5",
        title: "Wi-Fi ID/PW는 어디서 확인하나요?",
        description:
          "안테나가 달린 모뎀(AP)이나 공유기의 하단 라벨에서 확인하실 수 있어요. 라벨이 잘 보이지 않으면 기기를 살짝 들어 살펴봐 주세요.",
      },
      {
        id: "i6",
        title: "인터넷 사용 방법이나 장애 해결 영상을 보고 싶어요.",
        description:
          "자주 발생하는 문제와 해결 방법을 영상으로도 안내해 드리고 있어요. 아래 링크에서 확인해 보세요.",
        link: { label: "▶ 영상 가이드", href: "https://kt.com/he56" },
      },
    ],
  },
  tv: {
    key: "tv",
    label: "TV",
    intro: "TV 시청에 어려움이 있으신가요?",
    steps: [
      {
        id: "t1",
        title: "TV 화면이 안나와요.",
        description:
          "셋톱박스의 전원을 껐다 켜주세요. 추가로, 셋톱박스의 랜케이블이 잘 연결되어 있는지 확인해주세요.",
      },
      {
        id: "t2",
        title: "채널 이동이나 서비스 이용이 안돼요.",
        description: "셋톱박스를 전원을 껐다 켜고 1~2분 후 다시 시도해 주세요.",
      },
      {
        id: "t3",
        title: "리모컨이 작동하지 않아요.",
        description:
          "리모컨의 [TV 전원]과 [확인] 버튼을 3초간 동시에 눌러 재설정해 보세요. 페어링 문제로 인한 작동 불량이 해소될 수 있습니다.",
      },
    ],
  },
  phone: {
    key: "phone",
    label: "전화",
    intro: "전화 연결에 어려움이 있으신가요?",
    steps: [
      {
        id: "p1",
        title: "집전화가 안돼요.",
        description:
          "전화기 플러그와 전화선이 양쪽 모두 정상적으로 꽂혀 있는지 확인해 주세요.",
      },
      {
        id: "p2",
        title: "전화기를 여러 대 사용하는데 통화가 안돼요.",
        description:
          "전화기 중 한 대라도 수화기가 제대로 놓이지 않으면 모든 전화기에서 통화가 어려워질 수 있어요. 전체 전화기를 한 번씩 확인해 주세요.",
      },
      {
        id: "p3",
        title: "인터넷전화가 안돼요.",
        description:
          "모뎀 → 공유기 → 인터넷전화기 순서로 전원을 잠시 껐다가 다시 켜보세요. 순서가 중요하니 꼭 차례대로 진행해 주세요.",
      },
      {
        id: "p4",
        title: "전화기 화면이 나오지 않아요.",
        description:
          "배터리를 충분히 충전한 뒤 다시 켜보시고, 전원 어댑터의 연결 상태도 함께 살펴봐 주세요.",
      },
    ],
  },
};

export const PRODUCT_TABS: ReadonlyArray<{ value: ProductKey; label: string }> = [
  { value: "internet", label: "인터넷" },
  { value: "tv", label: "TV" },
  { value: "phone", label: "전화" },
];
