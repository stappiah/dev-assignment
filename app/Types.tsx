interface ProjectCategory {
  id: number;
  category: string;
}

interface Region {
  id: number;
  region: string;
}

export interface Project {
  id: number;
  name: string;
  partner: string;
  beneficiary_mmdce: string;
  beneficiary_community: string;
  amount: string;
  amount_currency: string;
  description: string;
  status: string;
  stateDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  category: number;
  beneficiary_region: number;
  project_category: ProjectCategory;
  region: Region;
}

export interface ProjectResponse {
  success: boolean;
  count: number;
  data: Project[];
}
