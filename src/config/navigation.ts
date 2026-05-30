// Navigation configuration: primary nav, explore group, footer sections.
// Icons are lucide-react string names resolved by consuming components.

import type { NavItem, NavSection } from "@/types/navigation";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";

export const primaryNav: NavItem[] = [
  { label: "Projects", href: ROUTES.projects, icon: "FolderGit2" },
  { label: "About", href: ROUTES.about, icon: "User" },
  { label: "Blog", href: ROUTES.blog, icon: "PenLine" },
  { label: "Contact", href: ROUTES.contact, icon: "Mail" },
];

export const exploreNav: NavItem[] = [
  {
    label: "Engineering Philosophy",
    href: ROUTES.philosophy,
    description: "Principles and craft behind the work",
    icon: "Compass",
  },
  {
    label: "Research",
    href: ROUTES.research,
    description: "Papers, experiments, and explorations",
    icon: "FlaskConical",
  },
  {
    label: "Open Source",
    href: ROUTES.openSource,
    description: "Libraries and contributions",
    icon: "GitFork",
  },
  {
    label: "Experience",
    href: ROUTES.experience,
    description: "Roles and professional history",
    icon: "Briefcase",
  },
  {
    label: "Timeline",
    href: ROUTES.timeline,
    description: "A chronological journey",
    icon: "GitCommitHorizontal",
  },
  {
    label: "Gallery",
    href: ROUTES.gallery,
    description: "Visual work and captures",
    icon: "Images",
  },
  {
    label: "Certificates",
    href: ROUTES.certificates,
    description: "Credentials and certifications",
    icon: "Award",
  },
  {
    label: "Achievements",
    href: ROUTES.achievements,
    description: "Milestones and recognition",
    icon: "Trophy",
  },
  {
    label: "GitHub",
    href: ROUTES.github,
    description: "Live activity and stats",
    icon: "Github",
  },
];

export const footerNav: NavSection[] = [
  {
    title: "Explore",
    items: exploreNav.map(({ label, href, icon }) => ({ label, href, icon })),
  },
  {
    title: "Connect",
    items: [
      { label: "GitHub", href: siteConfig.links.github, icon: "Github" },
      { label: "LinkedIn", href: siteConfig.links.linkedin, icon: "Linkedin" },
      { label: "Twitter", href: siteConfig.links.twitter, icon: "Twitter" },
      {
        label: "Email",
        href: `mailto:${siteConfig.links.email}`,
        icon: "Mail",
      },
    ],
  },
];

export const allNav: NavItem[] = [...primaryNav, ...exploreNav];
