import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Risk } from '../../../risk/models/risk.interface';

@Component({
  selector: 'app-shared-risk-list',
  templateUrl: './shared-risk-list.component.html',
  styleUrls: ['./shared-risk-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SharedRiskListComponent implements OnInit {
  @Input() isDashboard: boolean = true;
  @Input() showTitle: boolean = false;
  @Input() showPagination: boolean = false;
  @Input() maxItems: number = 10;

  searchQuery = '';
  searchTerm = '';
  openDropdownId: string | null = null;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  
  // Mock data for risks
  allRisks: Risk[] = [
    {
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
      reviewDate: '2023-12-15'
    },
    {
      id: 'RISK-002',
      description: 'System downtime during peak hours',
      likelihood: 'L4',
      severity: 'S4',
      riskLevel: 'Critical',
      riskLevelColor: 'critical',
      riskScore: 16,
      owner: 'IT Operations',
      status: 'Mitigated',
      statusColor: 'mitigated',
      reviewDate: '2023-11-30'
    },
    {
      id: 'RISK-003',
      description: 'Compliance violation in financial reporting',
      likelihood: 'L4',
      severity: 'S5',
      riskLevel: 'Critical',
      riskLevelColor: 'critical',
      riskScore: 20,
      owner: 'Finance Department',
      status: 'Closed',
      statusColor: 'closed',
      reviewDate: '2023-10-15'
    },
    {
      id: 'RISK-004',
      description: 'Supply chain disruption',
      likelihood: 'L3',
      severity: 'S4',
      riskLevel: 'High',
      riskLevelColor: 'high',
      riskScore: 12,
      owner: 'Procurement',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2023-12-20'
    },
    {
      id: 'RISK-005',
      description: 'Product quality defects',
      likelihood: 'L4',
      severity: 'S5',
      riskLevel: 'Critical',
      riskLevelColor: 'critical',
      riskScore: 20,
      owner: 'Quality Assurance',
      status: 'Mitigated',
      statusColor: 'mitigated',
      reviewDate: '2023-11-10'
    },
    {
      id: 'RISK-006',
      description: 'Network infrastructure failure',
      likelihood: 'L3',
      severity: 'S5',
      riskLevel: 'High',
      riskLevelColor: 'high',
      riskScore: 15,
      owner: 'IT Operations',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-01-15'
    },
    {
      id: 'RISK-007',
      description: 'Regulatory compliance violation',
      likelihood: 'L2',
      severity: 'S4',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 8,
      owner: 'Compliance Team',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-01-20'
    },
    {
      id: 'RISK-008',
      description: 'Third-party vendor security breach',
      likelihood: 'L3',
      severity: 'S4',
      riskLevel: 'High',
      riskLevelColor: 'high',
      riskScore: 12,
      owner: 'Security Team',
      status: 'Mitigated',
      statusColor: 'mitigated',
      reviewDate: '2024-01-10'
    },
    {
      id: 'RISK-009',
      description: 'Market volatility affecting operations',
      likelihood: 'L4',
      severity: 'S3',
      riskLevel: 'High',
      riskLevelColor: 'high',
      riskScore: 12,
      owner: 'Finance Department',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-02-01'
    },
    {
      id: 'RISK-010',
      description: 'Key personnel turnover',
      likelihood: 'L3',
      severity: 'S3',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 9,
      owner: 'HR Department',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-01-25'
    },
    {
      id: 'RISK-011',
      description: 'Software licensing compliance issues',
      likelihood: 'L2',
      severity: 'S3',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 6,
      owner: 'IT Operations',
      status: 'Closed',
      statusColor: 'closed',
      reviewDate: '2023-12-05'
    },
    {
      id: 'RISK-012',
      description: 'Customer data privacy breach',
      likelihood: 'L2',
      severity: 'S5',
      riskLevel: 'High',
      riskLevelColor: 'high',
      riskScore: 10,
      owner: 'Security Team',
      status: 'Mitigated',
      statusColor: 'mitigated',
      reviewDate: '2024-01-12'
    },
    {
      id: 'RISK-013',
      description: 'Natural disaster affecting operations',
      likelihood: 'L2',
      severity: 'S4',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 8,
      owner: 'Operations Team',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-02-15'
    },
    {
      id: 'RISK-014',
      description: 'Project budget overrun',
      likelihood: 'L4',
      severity: 'S3',
      riskLevel: 'High',
      riskLevelColor: 'high',
      riskScore: 12,
      owner: 'Project Management',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-01-30'
    },
    {
      id: 'RISK-015',
      description: 'Technology obsolescence',
      likelihood: 'L3',
      severity: 'S3',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 9,
      owner: 'IT Operations',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-03-01'
    },
    {
      id: 'RISK-016',
      description: 'Business process inefficiency',
      likelihood: 'L3',
      severity: 'S2',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 6,
      owner: 'Operations Team',
      status: 'Mitigated',
      statusColor: 'mitigated',
      reviewDate: '2024-01-08'
    },
    {
      id: 'RISK-017',
      description: 'Intellectual property theft',
      likelihood: 'L2',
      severity: 'S4',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 8,
      owner: 'Legal Department',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-02-10'
    },
    {
      id: 'RISK-018',
      description: 'Equipment failure and downtime',
      likelihood: 'L3',
      severity: 'S3',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 9,
      owner: 'Maintenance Team',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-02-05'
    },
    {
      id: 'RISK-019',
      description: 'Currency exchange rate fluctuation',
      likelihood: 'L4',
      severity: 'S2',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 8,
      owner: 'Finance Department',
      status: 'Mitigated',
      statusColor: 'mitigated',
      reviewDate: '2024-01-18'
    },
    {
      id: 'RISK-020',
      description: 'Competitor market entry',
      likelihood: 'L3',
      severity: 'S3',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 9,
      owner: 'Strategy Team',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-02-20'
    },
    {
      id: 'RISK-021',
      description: 'Environmental impact regulations',
      likelihood: 'L2',
      severity: 'S3',
      riskLevel: 'Low',
      riskLevelColor: 'low',
      riskScore: 6,
      owner: 'Compliance Team',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-03-10'
    },
    {
      id: 'RISK-022',
      description: 'Social media reputation damage',
      likelihood: 'L2',
      severity: 'S3',
      riskLevel: 'Low',
      riskLevelColor: 'low',
      riskScore: 6,
      owner: 'Marketing Team',
      status: 'Closed',
      statusColor: 'closed',
      reviewDate: '2023-12-28'
    },
    {
      id: 'RISK-023',
      description: 'Pandemic business disruption',
      likelihood: 'L2',
      severity: 'S4',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 8,
      owner: 'Executive Team',
      status: 'Mitigated',
      statusColor: 'mitigated',
      reviewDate: '2024-01-05'
    },
    {
      id: 'RISK-024',
      description: 'Cloud service provider outage',
      likelihood: 'L3',
      severity: 'S4',
      riskLevel: 'High',
      riskLevelColor: 'high',
      riskScore: 12,
      owner: 'IT Operations',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-02-25'
    },
    {
      id: 'RISK-025',
      description: 'Audit findings and penalties',
      likelihood: 'L2',
      severity: 'S3',
      riskLevel: 'Low',
      riskLevelColor: 'low',
      riskScore: 6,
      owner: 'Compliance Team',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-03-05'
    }
  ];

  filteredRisks: Risk[] = [];
  displayedRisks: Risk[] = [];
  paginatedRisks: Risk[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filterRisks();
  }

  filterRisks(): void {
    // Use both searchQuery and searchTerm for compatibility
    const searchValue = this.searchTerm || this.searchQuery;
    
    if (searchValue.trim()) {
      this.filteredRisks = this.allRisks.filter(risk =>
        risk.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        risk.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        risk.owner.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      this.filteredRisks = [...this.allRisks];
    }

    this.totalItems = this.filteredRisks.length;
    this.calculatePagination();

    if (this.isDashboard && this.maxItems) {
      this.displayedRisks = this.filteredRisks.slice(0, this.maxItems);
      this.paginatedRisks = this.displayedRisks;
    } else if (this.showPagination) {
      this.updatePaginatedRisks();
    } else {
      this.displayedRisks = this.filteredRisks;
      this.paginatedRisks = this.filteredRisks;
    }
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }
  }

  updatePaginatedRisks(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRisks = this.filteredRisks.slice(startIndex, endIndex);
    this.displayedRisks = this.paginatedRisks;
  }

  // Pagination methods
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedRisks();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedRisks();
    }
  }

  goToPage(pageNum: number): void {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.currentPage = pageNum;
      this.updatePaginatedRisks();
    }
  }

  changeItemsPerPage(newItemsPerPage: number): void {
    this.itemsPerPage = newItemsPerPage;
    this.currentPage = 1;
    this.calculatePagination();
    this.updatePaginatedRisks();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    const halfPages = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(1, this.currentPage - halfPages);
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Math object for template use
  Math = Math;

  // Badge class methods for Bootstrap 5
  getRiskLevelBadgeClass(riskLevelColor: string): string {
    switch (riskLevelColor) {
      case 'critical': return 'bg-danger';
      case 'high': return 'bg-warning text-dark';
      case 'medium': return 'bg-info';
      case 'low': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getStatusBadgeClass(statusColor: string): string {
    switch (statusColor) {
      case 'open': return 'bg-primary';
      case 'mitigated': return 'bg-warning text-dark';
      case 'closed': return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getLikelihoodBadgeClass(likelihood: string): string {
    switch (likelihood) {
      case 'L5': return 'bg-danger';
      case 'L4': return 'bg-warning text-dark';
      case 'L3': return 'bg-info';
      case 'L2': return 'bg-success';
      case 'L1': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  getSeverityBadgeClass(severity: string): string {
    switch (severity) {
      case 'S5': return 'bg-danger';
      case 'S4': return 'bg-warning text-dark';
      case 'S3': return 'bg-info';
      case 'S2': return 'bg-success';
      case 'S1': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  onRiskClick(risk: Risk): void {
    this.router.navigate(['/risk', risk.id]);
  }

  toggleDropdown(event: Event, riskId: string): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === riskId ? null : riskId;
  }

  viewBowtie(event: Event, risk: Risk): void {
    event.stopPropagation();
    this.openDropdownId = null;
    this.router.navigate(['/risk', risk.id]);
  }

  editRisk(event: Event, risk: Risk): void {
    event.stopPropagation();
    this.openDropdownId = null;
    this.router.navigate(['/risk', risk.id, 'edit']);
  }

  deleteRisk(event: Event, risk: Risk): void {
    event.stopPropagation();
    this.openDropdownId = null;
    // Implement delete logic
    console.log('Delete risk:', risk.id);
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.filterRisks();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.filterRisks();
  }
}
