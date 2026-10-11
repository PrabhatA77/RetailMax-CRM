import { Component, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ContactService, Contact } from '../../services/contact';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactList implements OnInit {
  // State lives in signals so Angular knows when to re-render (like useState in React)
  contacts = signal<Contact[]>([]);
  errorMessage = signal('');
  editingId = signal<number | null>(null);

  // Form fields
  name = signal('');
  email = signal('');
  phone = signal('');
  company = signal('');

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
      company: this.company()
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
    this.errorMessage.set('');
  }

  cancelEdit(): void {
    this.resetForm();
  }

  remove(contact: Contact): void {
    if (contact.id === undefined) return;
    if (!confirm(`Delete ${contact.name}?`)) return;

    this.contactService.delete(contact.id).subscribe({
      next: () => this.loadContacts(),
      error: (err: HttpErrorResponse) => this.errorMessage.set(this.extractError(err))
    });
  }

  private resetForm(): void {
    this.name.set('');
    this.email.set('');
    this.phone.set('');
    this.company.set('');
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