import type { ActionPriority } from '../../domain/shared/enums/action-priority.enum';
import type { ActionStatus } from '../../domain/shared/enums/action-status.enum';
import type { EntityDto, FullAuditedEntityDto } from '@abp/ng.core';
import type { ActionType } from '../../domain/shared/enums/action-type.enum';
import type { Likelihood } from '../../domain/shared/enums/likelihood.enum';
import type { Severity } from '../../domain/shared/enums/severity.enum';
import type { RiskStatus } from '../../domain/shared/enums/risk-status.enum';

export interface CreateMitigationActionForConsequenceDto {
  consequenceId: number;
  description: string;
  priority: ActionPriority;
  estimatedCost: number;
  assignedTo?: string;
  dueDate?: string;
  status?: ActionStatus;
}

export interface CreatePreventionActionForCauseDto {
  causeId: number;
  description: string;
  priority: ActionPriority;
  cost: number;
  assignedTo?: string;
  dueDate?: string;
  status?: ActionStatus;
}

export interface MitigationActionDto extends EntityDto<number> {
  consequenceId: number;
  description?: string;
  priority?: ActionPriority;
  status?: ActionStatus;
  estimatedCost: number;
  assignedTo?: string;
  dueDate?: string;
}

export interface PreventionActionDto extends EntityDto<number> {
  description?: string;
  cost: number;
  priority?: ActionPriority;
  status?: ActionStatus;
  assignedTo?: string;
  dueDate?: string;
}

export interface UpdateMitigationActionDto {
  description: string;
  priority: ActionPriority;
  estimatedCost: number;
  assignedTo?: string;
  dueDate?: string;
  status?: ActionStatus;
}

export interface UpdatePreventionActionDto {
  description: string;
  cost: number;
  priority: ActionPriority;
  assignedTo?: string;
  dueDate?: string;
  status?: ActionStatus;
}

export interface ActionItemDto {
  actionId?: string;
  description?: string;
  riskId?: string;
  riskDescription?: string;
  assignedTo?: string;
  status?: ActionStatus;
  dueDate?: string;
  daysOverdue: number;
  priority?: ActionPriority;
  type?: ActionType;
}

export interface ActionStatusSummaryDto {
  openCount: number;
  inProgressCount: number;
  completedCount: number;
  overdueCount: number;
  totalActionsCount: number;
  completionPercentage: number;
  completionProgressText?: string;
}

export interface ActionTrackerItemDto {
  actionId: number;
  action?: string;
  type?: string;
  relatedTo?: string;
  assignedTo?: string;
  dueDate?: string;
  status?: ActionStatus;
  priority?: ActionPriority;
  cost: number;
  relatedType?: string;
  relatedId: number;
}

export interface ActionTrackerStatsDto {
  openActionsCount: number;
  inProgressActionsCount: number;
  completedActionsCount: number;
  overdueActionsCount: number;
  overdueActions: ActionItemDto[];
  upcomingActions: ActionItemDto[];
}

export interface CauseDto extends EntityDto<number> {
  description?: string;
  likelihood?: Likelihood;
  severity?: Severity;
  probability: number;
  preventionActions: PreventionActionDto[];
}

export interface ConsequenceCostItemDto {
  description?: string;
  potentialCost: number;
  severity?: string;
}

export interface ConsequenceDto extends EntityDto<number> {
  description?: string;
  severity?: Severity;
  potentialCost: number;
  mitigationActions: MitigationActionDto[];
}

export interface CostBenefitAnalysisDto {
  implementationCosts: ImplementationCostsDto;
  potentialConsequenceCosts: PotentialConsequenceCostsDto;
  netBenefit: number;
  netBenefitDescription?: string;
}

export interface CreateCauseDto {
  description: string;
  likelihood: Likelihood;
  severity: Severity;
  preventionActions: CreatePreventionActionDto[];
}

export interface CreateCauseForRiskDto {
  riskId: number;
  description: string;
  likelihood: Likelihood;
  severity: Severity;
}

export interface CreateConsequenceDto {
  description: string;
  severity: Severity;
  potentialCost: number;
  mitigationActions: CreateMitigationActionDto[];
}

export interface CreateConsequenceForRiskDto {
  riskId: number;
  description: string;
  potentialCost: number;
}

export interface CreateMitigationActionDto {
  description: string;
  priority: ActionPriority;
  dueDate?: string;
}

export interface CreatePreventionActionDto {
  description: string;
  cost: number;
  priority: ActionPriority;
}

export interface CreateRiskDto {
  riskId: string;
  status: RiskStatus;
  description: string;
  businessDomain: string;
  riskOwner: string;
  reviewDate?: string;
  triggerEvents: string[];
  initialLikelihood: Likelihood;
  initialSeverity: Severity;
  residualLikelihood: Likelihood;
  residualSeverity: Severity;
  causes: CreateCauseDto[];
  consequences: CreateConsequenceDto[];
}

export interface DashboardStatsDto {
  totalRisks: number;
  totalRisksChange: number;
  highRisks: number;
  highRisksChange: number;
  mediumRisks: number;
  lowRisks: number;
  risksRequiringReview: number;
  openActions: number;
  openActionsChange: number;
  mitigatedRisks: number;
  mitigatedRisksChange: number;
  openPreventiveActions: number;
  openMitigationActions: number;
  totalPreventionCost: number;
  totalMitigationCost: number;
  risksByDomain: Record<string, number>;
  risksByStatus?: Record<RiskStatus, number>;
  risksByOwner: Record<string, number>;
}

export interface ImplementationCostsDto {
  preventiveActionsCost: number;
  mitigationActionsCost: number;
  totalImplementationCost: number;
}

export interface PotentialConsequenceCostsDto {
  consequenceCosts: ConsequenceCostItemDto[];
  totalPotentialCost: number;
}

export interface RiskDto extends FullAuditedEntityDto<number> {
  riskId?: string;
  status?: RiskStatus;
  description?: string;
  businessDomain?: string;
  riskOwner?: string;
  reviewDate?: string;
  triggerEvents: string[];
  initialLikelihood?: Likelihood;
  initialSeverity?: Severity;
  initialRiskLevel: number;
  residualLikelihood?: Likelihood;
  residualSeverity?: Severity;
  residualRiskLevel: number;
  causes: CauseDto[];
  consequences: ConsequenceDto[];
  requiresImmediateAction: boolean;
  requiresReview: boolean;
}

export interface RiskMatrixDto {
  matrix: Record<string, number>;
  lowRisksCount: number;
  mediumRisksCount: number;
  highRisksCount: number;
  criticalRisksCount: number;
}

export interface UpdateCauseDto {
  description: string;
  likelihood: Likelihood;
  severity: Severity;
  preventionActions: UpdatePreventionActionDto[];
}

export interface UpdateCauseForRiskDto {
  description: string;
  likelihood: Likelihood;
  severity: Severity;
}

export interface UpdateConsequenceDto {
  description: string;
  potentialCost: number;
  mitigationActions: UpdateMitigationActionDto[];
}

export interface UpdateConsequenceForRiskDto {
  description: string;
  potentialCost: number;
}

export interface UpdateRiskDto {
  riskId: string;
  status: RiskStatus;
  description: string;
  businessDomain?: string;
  riskOwner?: string;
  reviewDate?: string;
  initialLikelihood?: Likelihood;
  initialSeverity?: Severity;
  causes: UpdateCauseDto[];
  consequences: UpdateConsequenceDto[];
  triggerEvents: string[];
}
