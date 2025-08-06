export interface Risk {
  id: string;
  description: string;
  likelihood: string;
  severity: string;
  riskLevel: string;
  riskLevelColor: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number;
  owner: string;
  status: string;
  statusColor: 'open' | 'mitigated' | 'closed';
  reviewDate: string;
}

export interface RiskSearchFilter {
  searchTerm: string;
  status?: string;
  riskLevel?: string;
  owner?: string;
}
