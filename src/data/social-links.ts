// Social link data for the portfolio.
// `icon` values map to lucide-react icon names.

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/joshuasetiawann",
    icon: "Github",
  },
  {
    label: "Email",
    href: "mailto:thunityai@gmail.com",
    icon: "Mail",
  },
];
