import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ContactStatus = 'NEW' | 'CONTACTED' | 'NEGOTIATION' | 'CLOSED';

export const CONTACT_STATUSES: { value: ContactStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'NEGOTIATION', label: 'Negotiation' },
  { value: 'CLOSED', label: 'Closed' }
];

export interface Contact {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  dealValue?: number | null;
  status?: ContactStatus;
  statusChangedAt?: string | null;
  needsFollowUp?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private baseUrl = 'http://localhost:8080/api/contacts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  create(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, contact);
  }

  update(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${id}`, contact);
  }

  updateStatus(id: number, status: ContactStatus): Observable<Contact> {
    return this.http.patch<Contact>(`${this.baseUrl}/${id}/status`, { status });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}