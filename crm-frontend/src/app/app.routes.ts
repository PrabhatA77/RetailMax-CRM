import { Routes } from '@angular/router';
import { ContactList } from './components/contact-list/contact-list';
import { Reports } from './components/reports/reports';
import { Login } from './components/login/login';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'contacts', component: ContactList, canActivate: [authGuard] },
  { path: 'reports', component: Reports, canActivate: [authGuard] },
  { path: '**', redirectTo: 'contacts' }
];