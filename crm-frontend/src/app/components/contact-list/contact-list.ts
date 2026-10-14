import { Component, OnInit, computed, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ContactService, Contact, ContactStatus, CONTACT_STATUSES } from '../../services/contact';

type SortField = 'name' | 'email' | 'company' | 'dealValue' | 'statusChangedAt';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactList implements OnInit {
  statuses = CONTACT_STATUSES;

  contacts = signal<Contact[]>([]);
  errorMessage = signal('');
  editingId = signal<number | null>(null);

  // Filter, search and sort state
  statusFilter = signal<ContactStatus | 'ALL'>('ALL');
  searchTerm = signal('');
  sortField = signal<SortField | null>(null);
  sortDirection = signal<SortDirection>('asc');

  // What the table shows: status filter -> search -> sort (recalculates automatically)
  filteredContacts = computed(() => {
    const statusFilter = this.statusFilter();
    const term = this.searchTerm().trim().toLowerCase();
    const field = this.sortField();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;

    // filter() returns a new array, so sorting it below never changes the original list
    let list = this.contacts().filter(c => statusFilter === 'ALL' || c.status === statusFilter);

    if (term) {
      list = list.filter(c =>
        [c.name, c.email, c.company].some(value => (value ?? '').toLowerCase().includes(term))
      );
    }

    if (field) {
      list.sort((a, b) => {
        const x = a[field];
        const y = b[field];
        // Empty values always go to the bottom, whichever way you sort
        if (x == null && y == null) return 0;
        if (x == null) return 1;
        if (y == null) return -1;
        const result =
          typeof x === 'number' && typeof y === 'number'
            ? x - y
            : String(x).localeCompare(String(y), undefined, { sensitivity: 'base' });
        return result * direction;
      });
    }

    return list;
  });

  followUpCount = computed(() => this.contacts().filter(c => c.needsFollowUp).length);

  // Form fields
  name = signal('');
  email = signal('');
  phone = signal('');
  company = signal('');
  dealValue = signal<number | null>(null);

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getAll().subscribe({
      next: data => this.contacts.set(data),
      error: () => this.errorMessage.set('Could not load contacts. Is the backend running?')
    });
  }

  save(): void {
    this.errorMessage.set('');

    const contact: Contact = {
      name: this.name(),
      email: this.email(),
      phone: this.phone(),
      company: this.company(),
      dealValue: this.dealValue()
    };

    const id = this.editingId();
    const request$ =
      id === null
        ? this.contactService.create(contact)
        : this.contactService.update(id, contact);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.loadContacts();
      },
      error: (err: HttpErrorResponse) => this.errorMessage.set(this.extractError(err))
    });
  }

  edit(contact: Contact): void {
    this.editingId.set(contact.id ?? null);
    this.name.set(contact.name);
    this.email.set(contact.email);
    this.phone.set(contact.phone ?? '');
    this.company.set(contact.company ?? '');
    this.dealValue.set(contact.dealValue ?? null);
    this.errorMessage.set('');
  }

  cancelEdit(): void {
    this.resetForm();
  }

  changeStatus(contact: Contact, status: ContactStatus): void {
    if (contact.id === undefined) return;
    this.errorMessage.set('');

    this.contactService.updateStatus(contact.id, status).subscribe({
      next: updated =>
        this.contacts.update(list => list.map(c => (c.id === updated.id ? updated : c))),
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(this.extractError(err));
        this.loadContacts();
      }
    });
  }

  remove(contact: Contact): void {
    if (contact.id === undefined) return;
    if (!confirm(`Delete ${contact.name}?`)) return;

    this.contactService.delete(contact.id).subscribe({
      next: () => this.loadContacts(),
      error: (err: HttpErrorResponse) => this.errorMessage.set(this.extractError(err))
    });
  }

  // Click a column header: first click sorts ascending, second click flips to descending
  sortBy(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDirection.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
  }

  sortIndicator(field: SortField): string {
    if (this.sortField() !== field) return '';
    return this.sortDirection() === 'asc' ? ' ▲' : ' ▼';
  }

  // Downloads exactly what the table is showing right now (search, filter and sort included)
  exportCsv(): void {
    const header = ['Name', 'Email', 'Phone', 'Company', 'Status', 'Deal value', 'Last status change'];
    const lines = this.filteredContacts().map(c =>
      [c.name, c.email, c.phone, c.company, this.statusLabel(c.status), c.dealValue, c.statusChangedAt]
        .map(value => this.csvCell(value))
        .join(',')
    );

    // The \uFEFF at the start makes Excel read the file as UTF-8
    const csv = '\uFEFF' + [header.join(','), ...lines].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private statusLabel(status?: ContactStatus): string {
    return this.statuses.find(s => s.value === status)?.label ?? '';
  }

  private csvCell(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    let text = String(value);
    // A cell starting with = + - @ can run as a formula in Excel, so neutralise it
    if (/^[=+\-@]/.test(text)) text = "'" + text;
    return `"${text.replace(/"/g, '""')}"`;
  }

  private resetForm(): void {
    this.name.set('');
    this.email.set('');
    this.phone.set('');
    this.company.set('');
    this.dealValue.set(null);
    this.editingId.set(null);
    this.errorMessage.set('');
  }

  private extractError(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Cannot reach the server. Is the backend running?';
    const body = err.error;
    if (body?.errors) return Object.values(body.errors).join(', ');
    return body?.message ?? 'Something went wrong';
  }
}