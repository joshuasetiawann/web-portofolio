// Navigation data shapes for primary nav, explore group, and footer sections.

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
