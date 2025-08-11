import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Risk } from '../../models/risk.interface';

interface TriggerEvent {
  id: string;
  name: string;
}

@Component({
  selector: 'app-trigger-events',
  templateUrl: './trigger-events.component.html',
  styleUrls: ['./trigger-events.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TriggerEventsComponent {
  @Input() risk: Risk | null = null;
  @Output() riskUpdated = new EventEmitter<Risk>();

  newTriggerEvent: TriggerEvent = {
    id: '',
    name: ''
  };

  // Convert string array to TriggerEvent objects for display
  get triggerEvents(): TriggerEvent[] {
    if (!this.risk?.triggerEvents) {
      return [];
    }
    return this.risk.triggerEvents.map((eventName, index) => ({
      id: `TE${index + 1}`,
      name: eventName
    }));
  }

  updateRisk(): void {
    if (this.risk) {
      this.riskUpdated.emit(this.risk);
    }
  }

  addTriggerEvent(): void {
    if (this.newTriggerEvent.name.trim() && this.risk) {
      if (!this.risk.triggerEvents) {
        this.risk.triggerEvents = [];
      }
      this.risk.triggerEvents.push(this.newTriggerEvent.name.trim());
      this.resetNewTriggerEvent();
      this.updateRisk();
    }
  }

  removeTriggerEvent(triggerEventId: string): void {
    if (this.risk?.triggerEvents) {
      // Extract index from the ID (e.g., "TE1" -> index 0)
      const index = parseInt(triggerEventId.replace('TE', '')) - 1;
      if (index >= 0 && index < this.risk.triggerEvents.length) {
        this.risk.triggerEvents.splice(index, 1);
        this.updateRisk();
      }
    }
  }

  resetNewTriggerEvent(): void {
    this.newTriggerEvent = {
      id: '',
      name: ''
    };
  }
}
