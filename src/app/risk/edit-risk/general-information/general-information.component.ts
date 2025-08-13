import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Risk } from '../../models/risk.interface';
import { RiskStatus, riskStatusOptions } from '../../../proxy/risk-managment-system/domain/shared/enums/risk-status.enum';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GeneralInformationComponent implements OnInit, OnChanges {
  @Input() risk: Risk | null = null;
  @Output() riskUpdated = new EventEmitter<Risk>();

  // Make enum and options available to template
  riskStatusOptions = riskStatusOptions;
  RiskStatus = RiskStatus;

  ngOnInit(): void {
    this.loadRiskStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['risk'] && changes['risk'].currentValue) {
      this.loadRiskStatus();
    }
  }

  private loadRiskStatus(): void {
    if (this.risk && this.risk.status) {
      // Ensure the status is properly loaded and matches enum values
      console.log('Loading risk status:', this.risk.status);
      
      // If status is already a RiskStatus enum, no conversion needed
      // The status should already be properly typed as RiskStatus
    }
  }

  updateRisk(): void {
    if (this.risk) {
      debugger
      this.riskUpdated.emit(this.risk);
    }
  }
}
