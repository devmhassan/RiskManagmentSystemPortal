import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bowtie-components',
  templateUrl: './bowtie-components.component.html',
  styleUrls: ['./bowtie-components.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class BowtieComponentsComponent {
  bowtieForm: FormGroup;
  causesSections: number[] = [];

  constructor(private fb: FormBuilder) {
    this.bowtieForm = this.fb.group({
      causes: this.fb.array([]),
      consequences: this.fb.array([]),
      preventiveControls: this.fb.array([]),
      mitigatingControls: this.fb.array([])
    });

    // Add initial empty items
    this.addCause();
    this.addConsequence();
    this.addPreventiveControl();
    this.addMitigatingControl();
  }

  // Getters for form arrays
  get causes() {
    return this.bowtieForm.get('causes') as FormArray;
  }

  get consequences() {
    return this.bowtieForm.get('consequences') as FormArray;
  }

  get preventiveControls() {
    return this.bowtieForm.get('preventiveControls') as FormArray;
  }

  get mitigatingControls() {
    return this.bowtieForm.get('mitigatingControls') as FormArray;
  }

  getCauseControls(sectionIndex: number) {
    const startIndex = sectionIndex * 3; // Assuming 3 causes per section
    return this.causes.controls.slice(startIndex, startIndex + 3);
  }

  getCauseControlIndex(sectionIndex: number, causeIndex: number): number {
    return sectionIndex * 3 + causeIndex;
  }

  // Add methods
  addCause() {
    // Add a new section
    this.causesSections.push(this.causesSections.length);
    
    // Add three new cause controls for the new section
    for (let i = 0; i < 3; i++) {
      this.causes.push(this.fb.control('', Validators.required));
    }
  }

  addConsequence() {
    this.consequences.push(this.fb.control('', Validators.required));
  }

  addPreventiveControl() {
    this.preventiveControls.push(this.fb.control('', Validators.required));
  }

  addMitigatingControl() {
    this.mitigatingControls.push(this.fb.control('', Validators.required));
  }

  // Remove methods
  removeCause(index: number) {
    this.causes.removeAt(index);
  }

  removeConsequence(index: number) {
    this.consequences.removeAt(index);
  }

  removePreventiveControl(index: number) {
    this.preventiveControls.removeAt(index);
  }

  removeMitigatingControl(index: number) {
    this.mitigatingControls.removeAt(index);
  }
}
