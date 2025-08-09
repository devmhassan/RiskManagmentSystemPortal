import { Component, Input, Output, EventEmitter, OnInit, OnChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Risk } from '../../../risk/models/risk.interface';

@Component({
  selector: 'app-shared-risk-matrix',
  templateUrl: './shared-risk-matrix.component.html',
  styleUrls: ['./shared-risk-matrix.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SharedRiskMatrixComponent implements OnInit, OnChanges {
  @Input() risks: Risk[] = [];
  @Input() showTitle: boolean = true;
  @Input() showLegend: boolean = true;
  @Input() showDetails: boolean = false; // For risk list page detailed view
  @Input() interactive: boolean = false; // For hover and click interactions
  @Input() title: string = 'Risk Matrix';
  @Input() subtitle: string = 'Visualizing all risks based on likelihood and severity.';

  @Output() cellClicked = new EventEmitter<{likelihood: number, severity: number, risks: Risk[]}>();
  @Output() cellHovered = new EventEmitter<{likelihood: number, severity: number, risks: Risk[]}>();

  // Matrix properties for detailed view (risk-list)
  selectedMatrixRisks: Risk[] = [];
  selectedLikelihood: number = 0;
  selectedSeverity: number = 0;
  hoveredCell: { likelihood: number; severity: number } | null = null;
  tooltipPosition: { x: number; y: number } = { x: 0, y: 0 };

  // Risk categories count
  riskCategories = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  };

  ngOnInit(): void {
    this.updateRiskCategories();
  }

  ngOnChanges(): void {
    this.updateRiskCategories();
  }

  updateRiskCategories(): void {
    this.riskCategories = { low: 0, medium: 0, high: 0, critical: 0 };
    
    this.risks.forEach(risk => {
      const riskLevel = risk.riskLevelColor.toLowerCase();
      if (riskLevel in this.riskCategories) {
        this.riskCategories[riskLevel as keyof typeof this.riskCategories]++;
      }
    });
  }

  getRisksAtPosition(likelihood: number, severity: number): Risk[] {
    return this.risks.filter(risk => {
      const riskLikelihood = parseInt(risk.likelihood.substring(1));
      const riskSeverity = parseInt(risk.severity.substring(1));
      return riskLikelihood === likelihood && riskSeverity === severity;
    });
  }

  getCellClass(likelihood: number, severity: number): string {
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
    const baseClass = this.showDetails ? `matrix-cell-${riskLevel}` : riskLevel;
    return `${baseClass}${hasRisks ? ' has-risks' : ''}`;
  }

  getCellRiskCount(likelihood: number, severity: number): number {
    return this.getRisksAtPosition(likelihood, severity).length;
  }

  getRiskLevel(likelihood: number, severity: number): string {
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
    if (!this.interactive) return;

    const risks = this.getRisksAtPosition(likelihood, severity);
    
    if (this.showDetails) {
      this.selectedLikelihood = likelihood;
      this.selectedSeverity = severity;
      this.selectedMatrixRisks = risks;
    }

    this.cellClicked.emit({ likelihood, severity, risks });
  }

  onMatrixCellHover(likelihood: number, severity: number, event: MouseEvent): void {
    if (!this.interactive) return;

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

    const risks = this.getRisksAtPosition(likelihood, severity);
    this.cellHovered.emit({ likelihood, severity, risks });
  }

  onMatrixCellLeave(): void {
    if (!this.interactive) return;
    this.hoveredCell = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close details panel if clicking outside
    if (this.showDetails && this.selectedMatrixRisks.length > 0) {
      const target = event.target as HTMLElement;
      if (!target.closest('.risk-matrix-container')) {
        this.selectedMatrixRisks = [];
        this.selectedLikelihood = 0;
        this.selectedSeverity = 0;
      }
    }
  }
}
