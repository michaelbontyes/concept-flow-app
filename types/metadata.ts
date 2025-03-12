export interface Metadata {
  id: number;
  project_id: number;
  metadata_type: string;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
} 