import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Risk } from '../models/risk.interface';

@Component({
  selector: 'app-risk-list',
  templateUrl: './risk-list.component.html',
  styleUrls: ['./risk-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RiskListComponent implements OnInit {
  searchTerm: string = '';
  Math = Math; // Make Math available in template
  risks: Risk[] = [
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
      description: 'Cybersecurity vulnerability',
      likelihood: 'L3',
      severity: 'S5',
      riskLevel: 'High',
      riskLevelColor: 'high',
      riskScore: 15,
      owner: 'IT Security',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-01-05'
    },
    {
      id: 'RISK-007',
      description: 'Regulatory compliance failure',
      likelihood: 'L2',
      severity: 'S4',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 8,
      owner: 'Legal Department',
      status: 'Closed',
      statusColor: 'closed',
      reviewDate: '2023-09-20'
    },
    {
      id: 'RISK-008',
      description: 'Market demand fluctuation',
      likelihood: 'L4',
      severity: 'S3',
      riskLevel: 'High',
      riskLevelColor: 'high',
      riskScore: 12,
      owner: 'Sales Team',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-02-15'
    },
    {
      id: 'RISK-009',
      description: 'Employee turnover risk',
      likelihood: 'L3',
      severity: 'S3',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 9,
      owner: 'HR Department',
      status: 'Mitigated',
      statusColor: 'mitigated',
      reviewDate: '2023-12-01'
    },
    {
      id: 'RISK-010',
      description: 'Equipment failure during operations',
      likelihood: 'L2',
      severity: 'S4',
      riskLevel: 'Medium',
      riskLevelColor: 'medium',
      riskScore: 8,
      owner: 'Operations Team',
      status: 'Open',
      statusColor: 'open',
      reviewDate: '2024-01-20'
    }
  ];

  filteredRisks: Risk[] = [];
  paginatedRisks: Risk[] = [];
  selectedTab: 'register' | 'matrix' = 'register';
  openDropdownId: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  // Matrix properties
  selectedMatrixRisks: Risk[] = [];
  selectedLikelihood: number = 0;
  selectedSeverity: number = 0;
  hoveredCell: { likelihood: number; severity: number } | null = null;
  tooltipPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filteredRisks = [...this.risks];
    this.updatePagination();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    this.openDropdownId = null;
  }

  updatePagination(): void {
    this.totalItems = this.filteredRisks.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    // Ensure current page is within bounds
    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedRisks = this.filteredRisks.slice(startIndex, endIndex);
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.filteredRisks = this.risks.filter(risk =>
        risk.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        risk.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        risk.owner.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredRisks = [...this.risks];
    }
    this.currentPage = 1; // Reset to first page after search
    this.updatePagination();
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  changeItemsPerPage(newItemsPerPage: number): void {
    this.itemsPerPage = newItemsPerPage;
    this.currentPage = 1;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pageNumbers: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  }

  // Matrix methods
  getRisksAtPosition(likelihood: number, severity: number): Risk[] {
    return this.risks.filter(risk => {
      const riskLikelihood = parseInt(risk.likelihood.substring(1));
      const riskSeverity = parseInt(risk.severity.substring(1));
      return riskLikelihood === likelihood && riskSeverity === severity;
    });
  }

  getMatrixCellClass(likelihood: number, severity: number): string {
    const score = likelihood * severity;
    let riskLevel = '';
    
    if (score <= 3) {
      riskLevel = 'low';
    } else if (score <= 7) {
      riskLevel = 'medium';
    } else if (score <= 14) {
      riskLevel = 'high';
    } else {
      riskLevel = 'critical';
    }

    const hasRisks = this.getRisksAtPosition(likelihood, severity).length > 0;
    return `matrix-cell-${riskLevel}${hasRisks ? ' has-risks' : ''}`;
  }

  getMatrixRiskLevel(likelihood: number, severity: number): string {
    const score = likelihood * severity;
    
    if (score <= 3) {
      return `Low (${score})`;
    } else if (score <= 7) {
      return `Medium (${score})`;
    } else if (score <= 14) {
      return `High (${score})`;
    } else {
      return `Critical (${score})`;
    }
  }

  onMatrixCellClick(likelihood: number, severity: number): void {
    this.selectedLikelihood = likelihood;
    this.selectedSeverity = severity;
    this.selectedMatrixRisks = this.getRisksAtPosition(likelihood, severity);
  }

  onMatrixCellHover(likelihood: number, severity: number, event: MouseEvent): void {
    this.hoveredCell = { likelihood, severity };
    
    // Calculate tooltip position with offset and boundary checking
    const offsetX = 15;
    const offsetY = -15;
    let x = event.clientX + offsetX;
    let y = event.clientY + offsetY;
    
    // Simple boundary checking (adjust if tooltip goes off screen)
    if (x + 200 > window.innerWidth) {
      x = event.clientX - 200 - offsetX;
    }
    if (y < 0) {
      y = event.clientY + offsetX;
    }
    
    this.tooltipPosition = { x, y };
  }

  onMatrixCellLeave(): void {
    this.hoveredCell = null;
  }

  navigateToNewRisk(): void {
    this.router.navigate(['/risk/new']);
  }

  selectTab(tab: 'register' | 'matrix'): void {
    this.selectedTab = tab;
  }

  onRiskClick(risk: Risk): void {
    // Navigate to risk details or bowtie diagram
    console.log('Navigate to risk:', risk.id);
  }

  toggleDropdown(event: Event, riskId: string): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === riskId ? null : riskId;
  }

  viewBowtie(event: Event, risk: Risk): void {
    event.stopPropagation();
    console.log('View Bowtie for:', risk.id);
    this.openDropdownId = null;
    // Navigate to bowtie view
  }

  editRisk(event: Event, risk: Risk): void {
    event.stopPropagation();
    console.log('Edit risk:', risk.id);
    this.openDropdownId = null;
    // Navigate to edit risk
  }

  deleteRisk(event: Event, risk: Risk): void {
    event.stopPropagation();
    console.log('Delete risk:', risk.id);
    this.openDropdownId = null;
    // Show confirmation dialog and delete
  }

  onMoreActions(event: Event, risk: Risk): void {
    event.stopPropagation();
    // Handle more actions menu
    console.log('More actions for:', risk.id);
  }
}
