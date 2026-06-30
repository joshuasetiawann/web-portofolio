// Canonical route map for the 18-page portfolio scope.
// Single source of truth for all internal navigation targets.

export const ROUTES = {
  landing: "/",
  about: "/about",
  philosophy: "/philosophy",
  projects: "/projects",
  research: "/research",
  openSource: "/open-source",
  blog: "/blog",
  experience: "/experience",
  timeline: "/timeline",
  gallery: "/gallery",
  certificates: "/certificates",
  achievements: "/achievements",
  github: "/github",
  contact: "/contact",
} as const;

export type RouteName = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteName];

export const ROUTE_PATHS: RoutePath[] = Object.values(ROUTES);
