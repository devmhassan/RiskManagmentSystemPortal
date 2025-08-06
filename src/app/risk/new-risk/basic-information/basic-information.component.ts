import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class BasicInformationComponent {
  basicInfoForm: FormGroup;
  triggerEvents: string[] = [];
  businessDomains = ['Finance', 'Healthcare', 'IT', 'Operations', 'Sales', 'Marketing', 'HR', 'Legal'];

  constructor(private fb: FormBuilder) {
    this.basicInfoForm = this.fb.group({
      riskId: ['', Validators.required],
      status: ['Open', Validators.required],
      riskDescription: ['', Validators.required],
      businessDomain: ['', Validators.required],
      riskOwner: ['', Validators.required],
      reviewDate: ['', Validators.required],
      triggerEvents: ['']
    });
  }

  addTriggerEvent() {
    const triggerEvent = this.basicInfoForm.get('triggerEvents')?.value;
    if (triggerEvent && triggerEvent.trim()) {
      this.triggerEvents.push(triggerEvent.trim());
      this.basicInfoForm.patchValue({ triggerEvents: '' });
    }
  }

  removeTriggerEvent(index: number) {
    this.triggerEvents.splice(index, 1);
  }
}
