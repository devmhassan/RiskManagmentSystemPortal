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
  causesSections: any[] = [];
  consequencesSections: any[] = [];

  constructor(private fb: FormBuilder) {
    this.bowtieForm = this.fb.group({
      causes: this.fb.array([]),
      consequences: this.fb.array([])
    });

    // Add initial empty items
    this.addCause();
    this.addConsequence();
  }

  // Getters for form arrays
  get causes() {
    return this.bowtieForm.get('causes') as FormArray;
  }

  get consequences() {
    return this.bowtieForm.get('consequences') as FormArray;
  }

  getCauseControls(sectionIndex: number) {
    const startIndex = sectionIndex ; // Assuming 3 causes per section
    return this.causes.controls.slice(startIndex, startIndex + 3);
  }

  getCauseControlIndex(sectionIndex: number, causeIndex: number): number {
    return sectionIndex + causeIndex;
  }

  // Add methods
  addCause() {
    // Add a new cause section with its own preventive controls
    const causeIndex = this.causesSections.length;
    this.causesSections.push({
      index: causeIndex,
      preventiveControls: this.fb.array([this.fb.control('', Validators.required)])
    });
    
    // Add three new cause controls for the new section
    for (let i = 0; i < 3; i++) {
      this.causes.push(this.fb.control('', Validators.required));
    }
  }

  getPreventiveControls(causeIndex: number): FormArray {
    if (this.causesSections[causeIndex]) {
      return this.causesSections[causeIndex].preventiveControls;
    }
    return this.fb.array([]);
  }

  addPreventiveControl(causeIndex: number) {
    const preventiveControls = this.getPreventiveControls(causeIndex);
    preventiveControls.push(this.fb.control('', Validators.required));
  }

  addConsequence() {
    // Add a new consequence section with its own mitigation controls
    const consequenceIndex = this.consequencesSections.length;
    this.consequencesSections.push({
      index: consequenceIndex,
      mitigatingControls: this.fb.array([this.fb.control('', Validators.required)])
    });
    this.consequences.push(this.fb.control('', Validators.required));
  }

  getConsequenceControls(sectionIndex: number) {
    const startIndex = sectionIndex; // One consequence per section
    return this.consequences.controls.slice(startIndex, startIndex + 1);
  }

  getConsequenceControlIndex(sectionIndex: number): number {
    return sectionIndex;
  }

  getMitigatingControls(consequenceIndex: number): FormArray {
    if (this.consequencesSections[consequenceIndex]) {
      return this.consequencesSections[consequenceIndex].mitigatingControls;
    }
    return this.fb.array([]);
  }

  addMitigatingControl(consequenceIndex: number) {
    const mitigatingControls = this.getMitigatingControls(consequenceIndex);
    mitigatingControls.push(this.fb.control('', Validators.required));
  }

  // Remove methods
  removeCause(index: number) {
    this.causes.removeAt(index);
  }

  removeConsequence(index: number) {
    this.consequences.removeAt(index);
  }

  removePreventiveControl(causeIndex: number, controlIndex: number) {
    // Validate that we can't delete if there's only one preventive action
    const preventiveControls = this.getPreventiveControls(causeIndex);
    if (preventiveControls.length > 1) {
      preventiveControls.removeAt(controlIndex);
    }
  }

  removeMitigatingControl(consequenceIndex: number, controlIndex: number) {
    // Validate that we can't delete if there's only one mitigation action
    const mitigatingControls = this.getMitigatingControls(consequenceIndex);
    if (mitigatingControls.length > 1) {
      mitigatingControls.removeAt(controlIndex);
    }
  }

  canDeletePreventiveControl(causeIndex: number): boolean {
    const preventiveControls = this.getPreventiveControls(causeIndex);
    return preventiveControls.length > 1;
  }

  canDeleteMitigatingControl(consequenceIndex: number): boolean {
    const mitigatingControls = this.getMitigatingControls(consequenceIndex);
    return mitigatingControls.length > 1;
  }
}
