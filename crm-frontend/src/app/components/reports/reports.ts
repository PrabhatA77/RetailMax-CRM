import { Component, OnInit, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReportService, ReportSummary } from '../../services/report';
import { CONTACT_STATUSES } from '../../services/contact';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {
  summary = signal<ReportSummary | null>(null);
  errorMessage = signal('');

  // One bar per pipeline status; bar width is relative to the biggest count
  statusRows = computed(() => {
    const s = this.summary();
    if (!s) return [];
    const max = Math.max(1, ...Object.values(s.contactsByStatus));
    return CONTACT_STATUSES.map(st => {
      const count = s.contactsByStatus[st.value] ?? 0;
      return { value: st.value, label: st.label, count, percent: (count / max) * 100 };
    });
  });

  companyRows = computed(() => {
    const s = this.summary();
    if (!s) return [];
    const max = Math.max(1, ...s.topCompanies.map(c => c.count));
    return s.topCompanies.map(c => ({
      company: c.company,
      count: c.count,
      percent: (c.count / max) * 100
    }));
  });

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getSummary().subscribe({
      next: data => this.summary.set(data),
      error: () => this.errorMessage.set('Could not load reports. Is the backend running?')
    });
  }
}