import { Injectable } from '@angular/core';
import { Risk } from '../models/risk.interface';
import { RiskDto } from '../../proxy/risk-managment-system/risks/dtos/models';
import { RiskStatus } from '../../proxy/risk-managment-system/domain/shared/enums/risk-status.enum';
import { Likelihood } from '../../proxy/risk-managment-system/domain/shared/enums/likelihood.enum';
import { Severity } from '../../proxy/risk-managment-system/domain/shared/enums/severity.enum';

@Injectable({
  providedIn: 'root'
})
export class RiskMapperService {

  constructor() { }

  mapRiskDtoToRisk(riskDto: RiskDto): Risk {
    return {
      id: riskDto.riskId || '',
      description: riskDto.description || '',
      likelihood: this.mapLikelihoodToString(riskDto.residualLikelihood || riskDto.initialLikelihood),
      severity: this.mapSeverityToString(riskDto.residualSeverity || riskDto.initialSeverity),
      riskLevel: this.calculateRiskLevel(riskDto.residualRiskLevel),
      riskLevelColor: this.getRiskLevelColor(riskDto.residualRiskLevel),
      riskScore: riskDto.residualRiskLevel,
      owner: riskDto.riskOwner || '',
      status: this.mapStatusToString(riskDto.status),
      statusColor: this.getStatusColor(riskDto.status),
      reviewDate: riskDto.reviewDate || '',
      initialRisk: this.calculateRiskLevel(riskDto.initialRiskLevel),
      residualRisk: this.calculateRiskLevel(riskDto.residualRiskLevel),
      initialRiskColor: this.getRiskLevelColor(riskDto.initialRiskLevel),
      residualRiskColor: this.getRiskLevelColor(riskDto.residualRiskLevel)
    };
  }

  private mapLikelihoodToString(likelihood?: Likelihood): string {
    switch (likelihood) {
      case Likelihood.Rare:
        return 'L1';
      case Likelihood.Unlikely:
        return 'L2';
      case Likelihood.Possible:
        return 'L3';
      case Likelihood.Likely:
        return 'L4';
      case Likelihood.AlmostCertain:
        return 'L5';
      default:
        return 'L3';
    }
  }

  private mapSeverityToString(severity?: Severity): string {
    switch (severity) {
      case Severity.Negligible:
        return 'S1';
      case Severity.Minor:
        return 'S2';
      case Severity.Moderate:
        return 'S3';
      case Severity.Major:
        return 'S4';
      case Severity.Critical:
        return 'S5';
      default:
        return 'S3';
    }
  }

  private calculateRiskLevel(riskScore: number): string {
    if (riskScore >= 15) {
      return 'Critical';
    } else if (riskScore >= 10) {
      return 'High';
    } else if (riskScore >= 5) {
      return 'Medium';
    } else {
      return 'Low';
    }
  }

  private getRiskLevelColor(riskScore: number): 'critical' | 'high' | 'medium' | 'low' {
    if (riskScore >= 15) {
      return 'critical';
    } else if (riskScore >= 10) {
      return 'high';
    } else if (riskScore >= 5) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private mapStatusToString(status?: RiskStatus): string {
    switch (status) {
      case RiskStatus.Identified:
        return 'Identified';
      case RiskStatus.UnderAssessment:
        return 'Under Assessment';
      case RiskStatus.Assessed:
        return 'Assessed';
      case RiskStatus.Mitigating:
        return 'Mitigating';
      case RiskStatus.Mitigated:
        return 'Mitigated';
      case RiskStatus.Closed:
        return 'Closed';
      case RiskStatus.Reopened:
        return 'Reopened';
      default:
        return 'Open';
    }
  }

  private getStatusColor(status?: RiskStatus): 'open' | 'mitigated' | 'closed' {
    switch (status) {
      case RiskStatus.Identified:
      case RiskStatus.UnderAssessment:
      case RiskStatus.Assessed:
      case RiskStatus.Mitigating:
      case RiskStatus.Reopened:
        return 'open';
      case RiskStatus.Mitigated:
        return 'mitigated';
      case RiskStatus.Closed:
        return 'closed';
      default:
        return 'open';
    }
  }
}
