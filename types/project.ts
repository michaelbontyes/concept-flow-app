export interface Project {
  id: number;
  name: string;
  description: string;
  organization_id: number;
  created_at: string;
  updated_at: string;
  status: 'active' | 'archived' | 'draft';
} 