// Sample achievement data for the portfolio.
// Placeholder sample data — replace with real content (see docs/CONTENT-CHECKLIST.md)

export interface Achievement {
  title: string;
  date: string;
  category: string;
  description: string;
  link?: string;
}

export const achievements: Achievement[] = [
  {
    title: "Site of the Day",
    date: "2024-11",
    category: "Award",
    description:
      "Recognized for an immersive 3D product launch site featuring scroll-synced motion.",
    link: "https://example.com/awards/sotd",
  },
  {
    title: "Open Source Contributor of the Month",
    date: "2024-03",
    category: "Community",
    description: "Highlighted for sustained contributions to a popular animation toolkit.",
  },
  {
    title: "Hackathon Grand Prize",
    date: "2022-08",
    category: "Competition",
    description: "Led a four-person team to first place with a real-time collaborative whiteboard.",
    link: "https://example.com/hackathon",
  },
];
