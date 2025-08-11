export interface Risk {
  riskId: string; // The string RiskId from the backend
  id?: number; // The integer ID from the database
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
  businessDomain?: string; // Business domain for the risk
  initialRisk?: string;
  residualRisk?: string;
  initialRiskColor?: 'critical' | 'high' | 'medium' | 'low';
  residualRiskColor?: 'critical' | 'high' | 'medium' | 'low';
  triggerEvents?: string[]; // Array of trigger event strings from backend
  causes?: RiskCause[];
  consequences?: RiskConsequence[];
  discussions?: RiskDiscussion[];
}

export interface RiskCause {
  id: string;
  name: string;
  likelihood: string;
  priority: 'highest' | 'high' | 'medium' | 'low';
  preventiveActions: PreventiveAction[];
}

export interface PreventiveAction {
  id: string;
  name: string;
  cost: number;
  priority: 'highest' | 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'open' | 'disabled';
  assignedTo: string;
  dueDate: string;
}

export interface RiskConsequence {
  id: string;
  name: string;
  severity: string;
  cost: number;
  priority: 'highest' | 'high' | 'medium' | 'low';
  mitigationActions: MitigationAction[];
}

export interface MitigationAction {
  id: string;
  name: string;
  cost: number;
  priority: 'highest' | 'high' | 'medium' | 'low';
  status: 'completed' | 'in-progress' | 'open' | 'disabled';
  assignedTo: string;
  dueDate: string;
}

export interface RiskDiscussion {
  id: string;
  author: string;
  authorInitials: string;
  message: string;
  timestamp: string;
  time: string;
}

export interface RiskSearchFilter {
  searchTerm: string;
  status?: string;
  riskLevel?: string;
  owner?: string;
}
