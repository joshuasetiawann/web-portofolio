// Research entry shape for the /research collection.

export interface Research {
  slug: string;
  title: string;
  abstract: string;
  date: string;
  authors: string[];
  venue?: string;
  status: "published" | "preprint" | "wip";
  /** Grouping label used by the research category filter. */
  category: string;
  tags: string[];
  featured?: boolean;
  /** Optional personal reading/working status note. */
  readingStatus?: "reading" | "implemented" | "exploring";
  links: {
    pdf?: string;
    doi?: string;
    code?: string;
  };
}
