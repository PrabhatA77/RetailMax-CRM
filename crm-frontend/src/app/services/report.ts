import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CompanyCount {
  company: string;
  count: number;
}

export interface ReportSummary {
  totalContacts: number;
  closedContacts: number;
  conversionRate: number;
  needsFollowUp: number;
  contactsByStatus: Record<string, number>;
  topCompanies: CompanyCount[];
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<ReportSummary> {
    return this.http.get<ReportSummary>(`${this.baseUrl}/summary`);
  }
}