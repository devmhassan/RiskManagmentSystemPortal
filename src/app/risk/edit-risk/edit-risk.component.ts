import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Risk, RiskCause, RiskConsequence, PreventiveAction, MitigationAction } from '../models/risk.interface';
import { GeneralInformationComponent } from './general-information/general-information.component';
import { CausesPreventionComponent } from './causes-prevention/causes-prevention.component';
import { ConsequencesMitigationComponent } from './consequences-mitigation/consequences-mitigation.component';
import { TriggerEventsComponent } from './trigger-events/trigger-events.component';
import { RiskService } from '../../proxy/risk-managment-system/risks/risk.service';
import { RiskMapperService } from '../services/risk-mapper.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-risk',
  templateUrl: './edit-risk.component.html',
  styleUrls: ['./edit-risk.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    GeneralInformationComponent,
    CausesPreventionComponent,
    ConsequencesMitigationComponent,
    TriggerEventsComponent
  ]
})
export class EditRiskComponent implements OnInit {
  activeTab: string = 'general';
  riskId: string = '';
  risk: Risk | null = null;
  isLoading: boolean = false;
  isSaving: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private riskService: RiskService,
    private riskMapper: RiskMapperService
  ) {}

  ngOnInit(): void {
    this.riskId = this.route.snapshot.paramMap.get('id') || '';
    if (this.riskId) {
      this.loadRisk();
    } else {
      this.error = 'No risk ID provided';
    }
  }

  loadRisk(): void {
    // Convert string ID to number for the API call
    const riskIdNumber = parseInt(this.riskId, 10);
    
    if (isNaN(riskIdNumber)) {
      this.error = 'Invalid risk ID format';
      return;
    }

    this.isLoading = true;
    this.error = null;

    console.log('Loading risk with ID:', riskIdNumber);

    this.riskService.get(riskIdNumber)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (riskDto) => {
          console.log('Risk loaded from backend:', riskDto);
          this.risk = this.riskMapper.mapRiskDtoToRisk(riskDto);
          console.log('Mapped risk data:', this.risk);
        },
        error: (error) => {
          console.error('Error loading risk:', error);
          this.error = 'Failed to load risk data. Please try again.';
          this.risk = null;
        }
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/risk/list']);
  }

  saveChanges(): void {
    if (!this.risk) {
      this.error = 'No risk data to save';
      return;
    }

    this.isSaving = true;
    this.error = null;
    this.successMessage = null;

    console.log('Saving risk changes:', this.risk);

    // Map the frontend Risk to UpdateRiskDto
    const updateRiskDto = this.riskMapper.mapRiskToUpdateRiskDto(this.risk);
    console.log('Mapped UpdateRiskDto:', updateRiskDto);

    this.riskService.update(updateRiskDto)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: (updatedRiskDto) => {
          console.log('Risk successfully updated:', updatedRiskDto);
          this.successMessage = 'Risk has been successfully updated.';
          
          // Update the local risk data with the response from backend
          this.risk = this.riskMapper.mapRiskDtoToRisk(updatedRiskDto);
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          console.error('Error saving risk:', error);
          this.error = 'Failed to save risk changes. Please try again.';
          
          // Clear error message after 5 seconds
          setTimeout(() => {
            this.error = null;
          }, 5000);
        }
      });
  }

  onRiskUpdated(updatedRisk: Risk): void {
    this.risk = updatedRisk;
  }
}
