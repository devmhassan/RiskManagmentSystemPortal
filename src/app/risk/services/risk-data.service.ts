import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Risk } from '../models/risk.interface';

@Injectable({
  providedIn: 'root'
})
export class RiskDataService {
  private risksSubject = new BehaviorSubject<Risk[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public risks$ = this.risksSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor() { }

  updateRisks(risks: Risk[]): void {
    this.risksSubject.next(risks);
  }

  updateLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  updateError(error: string | null): void {
    this.errorSubject.next(error);
  }

  getCurrentRisks(): Risk[] {
    return this.risksSubject.value;
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}
