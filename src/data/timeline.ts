// Timeline data for the /timeline page.
// Real milestones, dated from github.com/joshuasetiawann repo history.

export type TimelineEventType = "role" | "launch" | "award" | "talk" | "education" | "milestone";

export interface TimelineEvent {
  date: string; // ISO (YYYY-MM or YYYY-MM-DD)
  year: number;
  title: string;
  type: TimelineEventType;
  description: string;
  ref?: string;
}

export const timeline: TimelineEvent[] = [
  {
    date: "2026-07",
    year: 2026,
    title: "RelayCLI started",
    type: "launch",
    description:
      "A provider-agnostic terminal coding agent on LiteLLM — installable with pipx, model of your choice.",
    ref: "/projects/relaycli",
  },
  {
    date: "2026-07",
    year: 2026,
    title: "Portfolio rebuilt as DATUM",
    type: "milestone",
    description:
      "This site — redesigned end to end as a reference instrument: graphite, Signal Blue, mono type, and a WebGL calibration hero.",
  },
  {
    date: "2026-06",
    year: 2026,
    title: "THUOS boots its desktop",
    type: "milestone",
    description:
      "The from-scratch x86 kernel reaches a 1024×768 truecolor desktop with USB-HID input across 20 releases — boot-verified in QEMU CI.",
    ref: "/projects/thuos",
  },
  {
    date: "2026-06",
    year: 2026,
    title: "AllHaven reaches v4.1",
    type: "launch",
    description:
      "The local-first AI command center matures: multi-agent chat, finance charts, an Android companion APK, and honest provider status checks.",
    ref: "/projects/allhaven",
  },
  {
    date: "2026-06",
    year: 2026,
    title: "Business apps in production",
    type: "launch",
    description:
      "Gudang Atomy, HL sales & receivables, Prime Property, Invento, and the Nexora AI marketplace all ship within one intense month.",
    ref: "/projects/gudang-atomy",
  },
  {
    date: "2025-05",
    year: 2025,
    title: "Into computer vision",
    type: "launch",
    description:
      "A YOLOv8 + OpenCV pipeline for detection on images, video, and live webcam — plus training on custom datasets.",
    ref: "/projects/yolov8-object-recognition",
  },
  {
    date: "2024-11",
    year: 2024,
    title: "First repos on GitHub",
    type: "milestone",
    description:
      "The building habit goes public: company-profile sites, early JavaScript projects, and an IoT waste-sorting experiment.",
  },
];

/** Events grouped by year, newest year first. */
export function getTimelineByYear(): { year: number; events: TimelineEvent[] }[] {
  const sorted = [...timeline].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const groups = new Map<number, TimelineEvent[]>();
  for (const event of sorted) {
    const list = groups.get(event.year) ?? [];
    list.push(event);
    groups.set(event.year, list);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, events]) => ({ year, events }));
}
