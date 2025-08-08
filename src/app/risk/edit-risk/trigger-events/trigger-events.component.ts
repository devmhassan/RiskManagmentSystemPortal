import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Risk } from '../../models/risk.interface';

interface TriggerEvent {
  id: string;
  name: string;
  description?: string;
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

  // Mock trigger events data - in real app this would come from service
  triggerEvents: TriggerEvent[] = [
    {
      id: 'TE1',
      name: 'Unusual login patterns',
      description: 'Multiple login attempts from different geographic locations within a short time frame'
    },
    {
      id: 'TE2',
      name: 'Multiple failed login attempts',
      description: 'Repeated failed authentication attempts that could indicate brute force attacks'
    }
  ];

  newTriggerEvent: TriggerEvent = {
    id: '',
    name: '',
    description: ''
  };

  updateRisk(): void {
    if (this.risk) {
      this.riskUpdated.emit(this.risk);
    }
  }

  addTriggerEvent(): void {
    if (this.newTriggerEvent.name.trim()) {
      const triggerEvent: TriggerEvent = {
        id: 'TE' + (Date.now()),
        name: this.newTriggerEvent.name.trim(),
        description: this.newTriggerEvent.description?.trim() || ''
      };
      this.triggerEvents.push(triggerEvent);
      this.resetNewTriggerEvent();
      this.updateRisk();
    }
  }

  removeTriggerEvent(triggerEventId: string): void {
    this.triggerEvents = this.triggerEvents.filter(te => te.id !== triggerEventId);
    this.updateRisk();
  }

  resetNewTriggerEvent(): void {
    this.newTriggerEvent = {
      id: '',
      name: '',
      description: ''
    };
  }
}
