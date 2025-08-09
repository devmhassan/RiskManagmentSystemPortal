import { Component, OnInit, OnChanges, Input } from '@angular/core';
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
export class SharedRiskListComponent implements OnInit, OnChanges {
  @Input() isDashboard: boolean = true;
  @Input() showTitle: boolean = false;
  @Input() showPagination: boolean = false;
  @Input() maxItems: number = 10;
  @Input() risks: Risk[] = []; // Accept risks as input
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;

  searchQuery = '';
  searchTerm = '';
  openDropdownId: string | null = null;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  
  // Working data arrays
  filteredRisks: Risk[] = [];
  displayedRisks: Risk[] = [];
  paginatedRisks: Risk[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeRisks();
  }

  ngOnChanges(): void {
    this.initializeRisks();
  }

  private initializeRisks(): void {
    // Use the input risks directly
    this.filterRisks();
  }

  filterRisks(): void {
    // Use both searchQuery and searchTerm for compatibility
    const searchValue = this.searchTerm || this.searchQuery;
    
    if (searchValue.trim()) {
      this.filteredRisks = this.risks.filter(risk =>
        risk.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        risk.riskId.toLowerCase().includes(searchValue.toLowerCase()) ||
        risk.owner.toLowerCase().includes(searchValue.toLowerCase())
      );
    } else {
      this.filteredRisks = [...this.risks];
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
    this.router.navigate(['/risk', risk.riskId]);
  }

  toggleDropdown(event: Event, riskId: string): void {
    event.stopPropagation();
    this.openDropdownId = this.openDropdownId === riskId ? null : riskId;
  }

  viewBowtie(event: Event, risk: Risk): void {
    event.stopPropagation();
    this.openDropdownId = null;
    this.router.navigate(['/risk', risk.riskId]);
  }

  editRisk(event: Event, risk: Risk): void {
    event.stopPropagation();
    this.openDropdownId = null;
    this.router.navigate(['/risk', risk.riskId, 'edit']);
  }

  deleteRisk(event: Event, risk: Risk): void {
    event.stopPropagation();
    this.openDropdownId = null;
    // Implement delete logic
    console.log('Delete risk:', risk.riskId);
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
