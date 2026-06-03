// Timeline data for the /timeline page.
// Placeholder sample data — replace with real content (see docs/CONTENT-CHECKLIST.md)

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
    date: "2025-06",
    year: 2025,
    title: "Promoted to Senior Frontend Engineer",
    type: "role",
    description: "Took ownership of the web platform team and the shared design system.",
  },
  {
    date: "2025-02",
    year: 2025,
    title: "Aurora Design System shipped",
    type: "launch",
    description: "A token-driven system adopted across four product surfaces.",
    ref: "/projects/aurora-design-system",
  },
  {
    date: "2024-11",
    year: 2024,
    title: "Site of the Day",
    type: "award",
    description: "Recognized for an immersive 3D product launch experience.",
  },
  {
    date: "2024-05",
    year: 2024,
    title: "Talk: Immersive without the lag",
    type: "talk",
    description: "A conference talk on shipping WebGL within a strict performance budget.",
  },
  {
    date: "2023-08",
    year: 2023,
    title: "Hackathon Grand Prize",
    type: "milestone",
    description: "Led a four-person team to first place with a realtime collaborative whiteboard.",
  },
  {
    date: "2021-01",
    year: 2021,
    title: "Joined Studio Northwind",
    type: "role",
    description: "Started building award-considered marketing sites blending WebGL and motion.",
  },
  {
    date: "2020-06",
    year: 2020,
    title: "B.Sc. Computer Science",
    type: "education",
    description: "Graduated with a focus on graphics and human-computer interaction.",
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
