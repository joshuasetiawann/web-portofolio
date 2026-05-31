// Project entity shape for the /projects collection and detail pages.

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectMedia {
  alt: string;
  src?: string;
  caption?: string;
  type?: "image" | "video";
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  role: string;
  year: number;
  status: "live" | "archived" | "wip";
  kind: "software" | "creative" | "research" | "oss";
  /** Human-readable category used by the project filter (e.g. "Web App"). */
  category: string;
  tags: string[];
  stack: string[];
  featured: boolean;
  order: number;
  links: {
    live?: string;
    repo?: string;
    caseStudy?: string;
  };
  cover?: string;
  accent?: string;

  // --- Optional case-study detail (Project Details page) ---
  client?: string;
  team?: string;
  timeline?: string;
  overview?: string;
  problem?: string;
  constraints?: string[];
  solution?: string;
  architecture?: string;
  features?: ProjectFeature[];
  media?: ProjectMedia[];
  metrics?: ProjectMetric[];
  lessons?: string[];
}
