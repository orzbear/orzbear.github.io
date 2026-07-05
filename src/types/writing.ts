export type WritingCategory = "ai-data" | "political-science" | "policy-writing";

export interface Writing {
  id: string;
  title: string;
  date: string;            
  summary: string;
  category: WritingCategory;
  tags?: string[];
  readTime?: string;       
  link?: string;
  publication?: string;
  lang?: string;
}
