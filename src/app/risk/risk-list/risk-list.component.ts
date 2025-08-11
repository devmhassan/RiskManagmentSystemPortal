import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Risk } from '../models/risk.interface';
import { SharedRiskListComponent } from '../../shared/components/shared-risk-list/shared-risk-list.component';
import { SharedRiskMatrixComponent } from '../../shared/components/shared-risk-matrix/shared-risk-matrix.component';
import { RiskService } from '../../proxy/risk-managment-system/risks/risk.service';
import { RiskMapperService } from '../services/risk-mapper.service';
import { RiskDataService } from '../services/risk-data.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-risk-list',
  templateUrl: './risk-list.component.html',
  styleUrls: ['./risk-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, SharedRiskListComponent, SharedRiskMatrixComponent]
})
export class RiskListComponent implements OnInit {
  searchTerm: string = '';
  Math = Math; // Make Math available in template
  risks: Risk[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  filteredRisks: Risk[] = [];
  paginatedRisks: Risk[] = [];
  selectedTab: 'register' | 'matrix' = 'register';
  openDropdownId: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor(
    private router: Router,
    private riskService: RiskService,
    private riskMapper: RiskMapperService,
    private riskDataService: RiskDataService
  ) {}

  ngOnInit(): void {
    this.loadRisks();
  }

  loadRisks(): void {
    this.isLoading = true;
    this.error = null;
    this.riskDataService.updateLoading(true);
    this.riskDataService.updateError(null);
    
    this.riskService.getList(this.searchTerm, true)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.riskDataService.updateLoading(false);
        })
      )
      .subscribe({
        next: (riskDtos) => {
          this.risks = riskDtos.map(dto => this.riskMapper.mapRiskDtoToRisk(dto));
          this.filteredRisks = [...this.risks];
          this.updatePagination();
          this.riskDataService.updateRisks(this.risks);
        },
        error: (error) => {
          console.error('Error loading risks:', error);
          this.error = 'Failed to load risks. Please try again.';
          this.riskDataService.updateError(this.error);
          this.risks = [];
          this.filteredRisks = [];
          this.updatePagination();
          this.riskDataService.updateRisks([]);
        }
      });
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
      // If there's a search term, use the API search
      this.loadRisks();
    } else {
      // If no search term, show all risks
      this.filteredRisks = [...this.risks];
      this.currentPage = 1;
      this.updatePagination();
    }
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

  // Matrix methods - these will be handled by the shared component
  onMatrixCellClick(data: {likelihood: number, severity: number, risks: Risk[]}): void {
    console.log('Matrix cell clicked:', data);
  }

  navigateToNewRisk(): void {
    this.router.navigate(['/risk/new']);
  }

  selectTab(tab: 'register' | 'matrix'): void {
    this.selectedTab = tab;
  }

  onRiskClick(risk: Risk): void {
    // Navigate to risk details using numeric ID
    if (risk.id) {
      this.router.navigate(['/risk', risk.id]);
    }
  }

  toggleDropdown(event: Event, risk: Risk): void {
    event.stopPropagation();
    const riskId = risk.id?.toString() || risk.riskId;
    this.openDropdownId = this.openDropdownId === riskId ? null : riskId;
  }

  viewBowtie(event: Event, risk: Risk): void {
    event.stopPropagation();
    this.openDropdownId = null;
    // Navigate to risk detail view using numeric ID
    if (risk.id) {
      this.router.navigate(['/risk', risk.id]);
    }
  }

  editRisk(event: Event, risk: Risk): void {
    event.stopPropagation();
    console.log('Edit risk:', risk.id);
    this.openDropdownId = null;
    // Navigate to edit using numeric ID
    if (risk.id) {
      this.router.navigate(['/risk', risk.id, 'edit']);
    }
  }

  deleteRisk(event: Event, risk: Risk): void {
    event.stopPropagation();
    console.log('Delete risk:', risk.id);
    this.openDropdownId = null;
    // Show confirmation dialog and delete
    // After successful deletion, reload the risks
    // this.loadRisks();
  }

  refreshRisks(): void {
    this.searchTerm = '';
    this.loadRisks();
  }

  onMoreActions(event: Event, risk: Risk): void {
    event.stopPropagation();
    // Handle more actions menu
    console.log('More actions for:', risk.id);
  }
}
