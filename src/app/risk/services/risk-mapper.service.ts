import { Injectable } from '@angular/core';
import { Risk, RiskCause, RiskConsequence, PreventiveAction, MitigationAction } from '../models/risk.interface';
import { RiskDto, CauseDto, ConsequenceDto, PreventionActionDto, MitigationActionDto, UpdateRiskDto, UpdateCauseDto, UpdateConsequenceDto, UpdatePreventionActionDto, UpdateMitigationActionDto } from '../../proxy/risk-managment-system/risks/dtos/models';
import { RiskStatus } from '../../proxy/risk-managment-system/domain/shared/enums/risk-status.enum';
import { Likelihood } from '../../proxy/risk-managment-system/domain/shared/enums/likelihood.enum';
import { Severity } from '../../proxy/risk-managment-system/domain/shared/enums/severity.enum';
import { ActionPriority } from '../../proxy/risk-managment-system/domain/shared/enums/action-priority.enum';
import { ActionStatus } from '../../proxy/risk-managment-system/domain/shared/enums/action-status.enum';

@Injectable({
  providedIn: 'root'
})
export class RiskMapperService {

  constructor() { }

  mapRiskDtoToRisk(riskDto: RiskDto): Risk {
    return {
      riskId: riskDto.riskId || '',
      id: riskDto.id,
      description: riskDto.description || '',
      likelihood: this.mapLikelihoodToString(riskDto.residualLikelihood || riskDto.initialLikelihood),
      severity: this.mapSeverityToString(riskDto.residualSeverity || riskDto.initialSeverity),
      riskLevel: this.calculateRiskLevel(riskDto.residualRiskLevel),
      riskLevelColor: this.getRiskLevelColor(riskDto.residualRiskLevel),
      riskScore: riskDto.residualRiskLevel,
      owner: riskDto.riskOwner || '',
      status: riskDto.status || RiskStatus.Identified,
      statusColor: this.getStatusColor(riskDto.status),
      reviewDate: riskDto.reviewDate || '',
      businessDomainId: riskDto.businessDomainId,
      businessDomainName: riskDto.businessDomainName || '',
      initialRisk: this.calculateRiskLevel(riskDto.initialRiskLevel),
      residualRisk: this.calculateRiskLevel(riskDto.residualRiskLevel),
      initialRiskColor: this.getRiskLevelColor(riskDto.initialRiskLevel),
      residualRiskColor: this.getRiskLevelColor(riskDto.residualRiskLevel),
      triggerEvents: riskDto.triggerEvents || [],
      causes: this.mapCauseDtosToRiskCauses(riskDto.causes || []),
      consequences: this.mapConsequenceDtosToRiskConsequences(riskDto.consequences || [])
    };
  }

  mapRiskToUpdateRiskDto(risk: Risk): UpdateRiskDto {
    return {
      riskId: risk.riskId,
      status: risk.status,
      description: risk.description,
      businessDomainId: risk.businessDomainId || 0,
      riskOwner: risk.owner,
      reviewDate: risk.reviewDate,
      initialLikelihood: this.mapStringToLikelihood(risk.likelihood),
      initialSeverity: this.mapStringToSeverity(risk.severity),
      causes: this.mapRiskCausesToUpdateCauseDtos(risk.causes || []),
      consequences: this.mapRiskConsequencesToUpdateConsequenceDtos(risk.consequences || []),
      triggerEvents: risk.triggerEvents || []
    };
  }

  private mapLikelihoodToString(likelihood?: Likelihood): string {
    switch (likelihood) {
      case Likelihood.Rare: return 'L1';
      case Likelihood.Unlikely: return 'L2';
      case Likelihood.Possible: return 'L3';
      case Likelihood.Likely: return 'L4';
      case Likelihood.AlmostCertain: return 'L5';
      default: return 'L3';
    }
  }

  private mapSeverityToString(severity?: Severity): string {
    switch (severity) {
      case Severity.Negligible: return 'S1';
      case Severity.Minor: return 'S2';
      case Severity.Moderate: return 'S3';
      case Severity.Major: return 'S4';
      case Severity.Critical: return 'S5';
      default: return 'S3';
    }
  }

  private calculateRiskLevel(riskScore: number): string {
    if (riskScore >= 15) return 'Critical';
    else if (riskScore >= 10) return 'High';
    else if (riskScore >= 5) return 'Medium';
    else return 'Low';
  }

  private getRiskLevelColor(riskScore: number): 'critical' | 'high' | 'medium' | 'low' {
    if (riskScore >= 15) return 'critical';
    else if (riskScore >= 10) return 'high';
    else if (riskScore >= 5) return 'medium';
    else return 'low';
  }

  private getStatusColor(status?: RiskStatus): 'identified' | 'under-assessment' | 'assessed' | 'mitigating' | 'mitigated' | 'closed' | 'reopened' {
    switch (status) {
      case RiskStatus.Identified: return 'identified';
      case RiskStatus.UnderAssessment: return 'under-assessment';
      case RiskStatus.Assessed: return 'assessed';
      case RiskStatus.Mitigating: return 'mitigating';
      case RiskStatus.Mitigated: return 'mitigated';
      case RiskStatus.Closed: return 'closed';
      case RiskStatus.Reopened: return 'reopened';
      default: return 'identified';
    }
  }

  private mapCauseDtosToRiskCauses(causeDtos: CauseDto[]): RiskCause[] {
    return causeDtos.map(causeDto => ({
      id: causeDto.id?.toString() || '',
      name: causeDto.description || '',
      likelihood: this.mapLikelihoodToString(causeDto.likelihood),
      priority: this.mapLikelihoodToPriority(causeDto.likelihood),
      preventiveActions: this.mapPreventionActionDtosToPreventiveActions(causeDto.preventionActions || [])
    }));
  }

  private mapConsequenceDtosToRiskConsequences(consequenceDtos: ConsequenceDto[]): RiskConsequence[] {
    return consequenceDtos.map(consequenceDto => ({
      id: consequenceDto.id?.toString() || '',
      name: consequenceDto.description || '',
      severity: this.mapSeverityToString(consequenceDto.severity),
      cost: consequenceDto.potentialCost || 0,
      priority: this.mapSeverityToPriority(consequenceDto.severity),
      mitigationActions: this.mapMitigationActionDtosToMitigationActions(consequenceDto.mitigationActions || [])
    }));
  }

  private mapPreventionActionDtosToPreventiveActions(actionDtos: PreventionActionDto[]): PreventiveAction[] {
    return actionDtos.map(actionDto => ({
      id: actionDto.id?.toString() || '',
      name: actionDto.description || '',
      cost: actionDto.cost || 0,
      priority: this.mapActionPriorityToString(actionDto.priority),
      status: this.mapActionStatusToString(actionDto.status),
      assignedTo: actionDto.assignedTo || '',
      dueDate: actionDto.dueDate || ''
    }));
  }

  private mapMitigationActionDtosToMitigationActions(actionDtos: MitigationActionDto[]): MitigationAction[] {
    return actionDtos.map(actionDto => ({
      id: actionDto.id?.toString() || '',
      name: actionDto.description || '',
      cost: actionDto.estimatedCost || 0,
      priority: this.mapActionPriorityToString(actionDto.priority),
      status: this.mapActionStatusToString(actionDto.status),
      assignedTo: actionDto.assignedTo || '',
      dueDate: actionDto.dueDate || ''
    }));
  }

  private mapActionPriorityToString(priority?: ActionPriority): 'low' | 'medium' | 'high' | 'highest' {
    switch (priority) {
      case ActionPriority.Low: return 'low';
      case ActionPriority.Medium: return 'medium';
      case ActionPriority.High: return 'high';
      case ActionPriority.Urgent:
      case ActionPriority.Immediate: return 'highest';
      default: return 'medium';
    }
  }

  private mapActionStatusToString(status?: ActionStatus): 'open' | 'in-progress' | 'completed' | 'disabled' {
    switch (status) {
      case ActionStatus.NotStarted: return 'open';
      case ActionStatus.InProgress: return 'in-progress';
      case ActionStatus.Completed: return 'completed';
      case ActionStatus.Cancelled:
      case ActionStatus.OnHold: return 'disabled';
      default: return 'open';
    }
  }

  private mapSeverityToPriority(severity?: Severity): 'low' | 'medium' | 'high' | 'highest' {
    switch (severity) {
      case Severity.Negligible: return 'low';
      case Severity.Minor: return 'medium';
      case Severity.Moderate: return 'high';
      case Severity.Major:
      case Severity.Critical: return 'highest';
      default: return 'medium';
    }
  }

  private mapLikelihoodToPriority(likelihood?: Likelihood): 'low' | 'medium' | 'high' | 'highest' {
    switch (likelihood) {
      case Likelihood.Rare: return 'low';
      case Likelihood.Unlikely: return 'medium';
      case Likelihood.Possible: return 'medium';
      case Likelihood.Likely: return 'high';
      case Likelihood.AlmostCertain: return 'highest';
      default: return 'medium';
    }
  }

  private mapStringToLikelihood(likelihoodString: string): Likelihood {
    switch (likelihoodString) {
      case 'L1': return Likelihood.Rare;
      case 'L2': return Likelihood.Unlikely;
      case 'L3': return Likelihood.Possible;
      case 'L4': return Likelihood.Likely;
      case 'L5': return Likelihood.AlmostCertain;
      default: return Likelihood.Possible;
    }
  }

  private mapStringToSeverity(severityString: string): Severity {
    switch (severityString) {
      case 'S1': return Severity.Negligible;
      case 'S2': return Severity.Minor;
      case 'S3': return Severity.Moderate;
      case 'S4': return Severity.Major;
      case 'S5': return Severity.Critical;
      default: return Severity.Moderate;
    }
  }

  private mapStringToActionPriority(priorityString: string): ActionPriority {
    switch (priorityString) {
      case 'low': return ActionPriority.Low;
      case 'medium': return ActionPriority.Medium;
      case 'high': return ActionPriority.High;
      case 'highest': return ActionPriority.Urgent;
      default: return ActionPriority.Medium;
    }
  }

  private mapStringToActionStatus(statusString: string): ActionStatus {
    switch (statusString) {
      case 'open': return ActionStatus.NotStarted;
      case 'in-progress': return ActionStatus.InProgress;
      case 'completed': return ActionStatus.Completed;
      case 'disabled': return ActionStatus.Cancelled;
      default: return ActionStatus.NotStarted;
    }
  }

  private mapRiskCausesToUpdateCauseDtos(causes: RiskCause[]): UpdateCauseDto[] {
    return causes.map(cause => ({
      id: cause.id ? parseInt(cause.id, 10) : undefined,
      description: cause.name,
      likelihood: this.mapStringToLikelihood(cause.likelihood),
      severity: Severity.Moderate,
      preventionActions: this.mapPreventiveActionsToUpdatePreventionActionDtos(cause.preventiveActions || [])
    }));
  }

  private mapRiskConsequencesToUpdateConsequenceDtos(consequences: RiskConsequence[]): UpdateConsequenceDto[] {
    return consequences.map(consequence => ({
      id: consequence.id ? parseInt(consequence.id, 10) : undefined,
      description: consequence.name,
      potentialCost: consequence.cost,
      mitigationActions: this.mapMitigationActionsToUpdateMitigationActionDtos(consequence.mitigationActions || [])
    }));
  }

  private mapPreventiveActionsToUpdatePreventionActionDtos(actions: PreventiveAction[]): UpdatePreventionActionDto[] {
    return actions.map(action => ({
      id: action.id ? parseInt(action.id, 10) : undefined,
      description: action.name,
      cost: action.cost,
      priority: this.mapStringToActionPriority(action.priority),
      assignedTo: action.assignedTo,
      dueDate: action.dueDate,
      status: this.mapStringToActionStatus(action.status)
    }));
  }

  private mapMitigationActionsToUpdateMitigationActionDtos(actions: MitigationAction[]): UpdateMitigationActionDto[] {
    return actions.map(action => ({
      id: action.id ? parseInt(action.id, 10) : undefined,
      description: action.name,
      priority: this.mapStringToActionPriority(action.priority),
      estimatedCost: action.cost,
      assignedTo: action.assignedTo,
      dueDate: action.dueDate,
      status: this.mapStringToActionStatus(action.status)
    }));
  }
}
