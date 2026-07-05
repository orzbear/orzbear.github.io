export interface Project {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  year: number;
  type: string;
  featured?: boolean;
  featuredRank?: number;
  metrics?: string[];
  image?: string;
  images?: string[];
  links?: {
    demo?: string;
    github?: string;
  };
}
