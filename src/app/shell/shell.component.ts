import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkspaceToolsComponent } from './workspace-tools.component';
import { AuthService } from '../core/auth.service';
import { UiIconComponent } from '../ui-icon.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, UiIconComponent, WorkspaceToolsComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  sidebarOpen = false;
  readonly name = localStorage.getItem('mtrm_teacher_name') || 'MTRM Teacher';
  readonly initials = this.name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  readonly nav = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/sessions', label: 'My sessions', icon: 'calendar' },
    { path: '/attendance', label: 'Attendance', icon: 'users' },
    { path: '/materials', label: 'Course materials', icon: 'reports' }
  ];

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed()).subscribe(() => this.sidebarOpen = false);
  }
}
