// Sample certificate data for the portfolio.
// Placeholder sample data — replace with real content (see docs/CONTENT-CHECKLIST.md)

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
  skills: string[];
}

export const certificates: Certificate[] = [
  {
    name: "Advanced React Patterns",
    issuer: "Frontend Masters",
    date: "2025-02",
    credentialId: "FM-ARP-2025-0421",
    url: "https://example.com/certificates/advanced-react",
    skills: ["React", "Hooks", "Performance"],
  },
  {
    name: "Professional Cloud Developer",
    issuer: "Cloud Academy",
    date: "2024-09",
    credentialId: "CA-PCD-88213",
    url: "https://example.com/certificates/cloud-developer",
    skills: ["Cloud", "CI/CD", "Containers"],
  },
  {
    name: "Creative WebGL Fundamentals",
    issuer: "Awwwards Academy",
    date: "2023-05",
    skills: ["WebGL", "Three.js", "Shaders"],
  },
];
