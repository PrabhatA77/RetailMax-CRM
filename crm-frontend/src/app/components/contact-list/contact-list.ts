import { Component, OnInit } from '@angular/core';
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
  contacts: Contact[] = [];
  newContact: Contact = { name: '', email: '', phone: '', company: '' };

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getAll().subscribe(data => this.contacts = data);
  }

  addContact(): void {
    this.contactService.create(this.newContact).subscribe(() => {
      this.newContact = { name: '', email: '', phone: '', company: '' };
      this.loadContacts();
    });
  }
}