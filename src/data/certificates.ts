// Certificate data for the portfolio.
// Intentionally empty until real credentials are earned — the page renders an
// honest empty state instead of placeholder certificates.

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  url?: string;
  skills: string[];
}

export const certificates: Certificate[] = [];
