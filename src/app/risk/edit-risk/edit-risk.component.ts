import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Risk, RiskCause, RiskConsequence, PreventiveAction, MitigationAction } from '../models/risk.interface';
import { GeneralInformationComponent } from './general-information/general-information.component';
import { CausesPreventionComponent } from './causes-prevention/causes-prevention.component';
import { ConsequencesMitigationComponent } from './consequences-mitigation/consequences-mitigation.component';
import { TriggerEventsComponent } from './trigger-events/trigger-events.component';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.riskId = this.route.snapshot.paramMap.get('id') || '';
    this.loadRisk();
  }

  loadRisk(): void {
    // Mock data - in real app this would come from a service
    this.risk = {
      id: 'RISK-001',
      description: 'Data breach due to unauthorized access',
      likelihood: 'L5',
      severity: 'S5',
      riskLevel: 'Critical',
      riskLevelColor: 'critical',
      riskScore: 25,
      owner: 'Security Team',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2023-12-15',
      initialRisk: 'Critical (20)',
      residualRisk: 'High (8)',
      initialRiskColor: 'critical',
      residualRiskColor: 'high',
      causes: [
        {
          id: 'C1',
          name: 'Weak password policies',
          likelihood: 'L4',
          priority: 'high',
          preventiveActions: [
            {
              id: 'PA1',
              name: 'Implement strong password requirements',
              cost: 5000,
              priority: 'high',
              status: 'completed',
              assignedTo: 'John Smith (IT Security)',
              dueDate: '11/15/2023'
            },
            {
              id: 'PA2',
              name: 'Regular password rotation',
              cost: 2000,
              priority: 'medium',
              status: 'in-progress',
              assignedTo: 'Sarah Johnson (IT Operations)',
              dueDate: '12/20/2023'
            }
          ]
        },
        {
          id: 'C2',
          name: 'Lack of access controls',
          likelihood: 'L3',
          priority: 'medium',
          preventiveActions: [
            {
              id: 'PA3',
              name: 'Implement role-based access control',
              cost: 15000,
              priority: 'high',
              status: 'completed',
              assignedTo: 'Michael Chen (IT Security)',
              dueDate: '10/30/2023'
            }
          ]
        },
        {
          id: 'C3',
          name: 'Insufficient security training',
          likelihood: 'L5',
          priority: 'highest',
          preventiveActions: [
            {
              id: 'PA4',
              name: 'Security awareness training',
              cost: 12000,
              priority: 'high',
              status: 'completed',
              assignedTo: 'David Wilson (HR)',
              dueDate: '09/15/2023'
            },
            {
              id: 'PA5',
              name: 'Phishing simulations',
              cost: 7500,
              priority: 'medium',
              status: 'in-progress',
              assignedTo: 'David Wilson (HR)',
              dueDate: '12/10/2023'
            }
          ]
        }
      ],
      consequences: [
        {
          id: 'CON1',
          name: 'Regulatory penalties',
          severity: 'S4',
          cost: 250000,
          priority: 'high',
          mitigationActions: [
            {
              id: 'MA1',
              name: 'Compliance documentation',
              cost: 10000,
              priority: 'high',
              status: 'completed',
              assignedTo: 'Jessica Lee (Legal)',
              dueDate: '11/1/2023'
            },
            {
              id: 'MA2',
              name: 'Regulatory reporting procedures',
              cost: 5000,
              priority: 'medium',
              status: 'completed',
              assignedTo: 'Jessica Lee (Legal)',
              dueDate: '10/15/2023'
            }
          ]
        },
        {
          id: 'CON2',
          name: 'Reputation damage',
          severity: 'S5',
          cost: 500000,
          priority: 'highest',
          mitigationActions: [
            {
              id: 'MA3',
              name: 'PR crisis management plan',
              cost: 25000,
              priority: 'high',
              status: 'completed',
              assignedTo: 'Robert Taylor (Communications)',
              dueDate: '09/30/2023'
            },
            {
              id: 'MA4',
              name: 'Transparent communication strategy',
              cost: 15000,
              priority: 'medium',
              status: 'in-progress',
              assignedTo: 'Robert Taylor (Communications)',
              dueDate: '01/30/2024'
            }
          ]
        },
        {
          id: 'CON3',
          name: 'Customer data exposure',
          severity: 'S3',
          cost: 350000,
          priority: 'high',
          mitigationActions: [
            {
              id: 'MA5',
              name: 'Customer notification procedures',
              cost: 20000,
              priority: 'medium',
              status: 'completed',
              assignedTo: 'Amanda Brown (Customer Service)',
              dueDate: '10/20/2023'
            },
            {
              id: 'MA6',
              name: 'Identity protection services',
              cost: 75000,
              priority: 'high',
              status: 'completed',
              assignedTo: 'Amanda Brown (Customer Service)',
              dueDate: '11/15/2023'
            }
          ]
        }
      ]
    };
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/risk/list']);
  }

  saveChanges(): void {
    console.log('Saving changes for risk:', this.risk);
    // Implementation for saving changes
  }

  onRiskUpdated(updatedRisk: Risk): void {
    this.risk = updatedRisk;
  }
}
