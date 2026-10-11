import { Routes } from '@angular/router';
import { ContactList } from './components/contact-list/contact-list';
import { Reports } from './components/reports/reports';

export const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  { path: 'contacts', component: ContactList },
  { path: 'reports', component: Reports }
];