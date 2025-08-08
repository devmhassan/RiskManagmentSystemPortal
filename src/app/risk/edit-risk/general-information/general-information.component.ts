import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Risk } from '../../models/risk.interface';

@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GeneralInformationComponent {
  @Input() risk: Risk | null = null;
  @Output() riskUpdated = new EventEmitter<Risk>();

  updateRisk(): void {
    if (this.risk) {
      this.riskUpdated.emit(this.risk);
    }
  }
}
