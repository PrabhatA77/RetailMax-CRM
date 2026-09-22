import { Component } from '@angular/core';
import { ContactList } from './components/contact-list/contact-list';

@Component({
  selector: 'app-root',
  imports: [ContactList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'crm-frontend';
}