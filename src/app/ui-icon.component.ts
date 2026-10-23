import { Component, Input } from '@angular/core';

const ICONS: Record<string, string[]> = {
  edit: ['M16 3l5 5-12 12-6 1 1-6z', 'M13 6l5 5'],
  dashboard: ['M3 3h7v7H3z', 'M14 3h7v4h-7z', 'M14 11h7v10h-7z', 'M3 14h7v7H3z'],
  calendar: ['M3 5h18v16H3z', 'M16 3v4', 'M8 3v4', 'M3 10h18'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  teacher: ['M3 4h18v14H3z', 'M8 22h8', 'M12 18v4', 'M7 9l3 2 4-4 3 2'],
  building: ['M3 21h18', 'M6 21V5l6-3 6 3v16', 'M9 8h.01', 'M15 8h.01', 'M9 12h.01', 'M15 12h.01', 'M9 16h.01', 'M15 16h.01'],
  certificate: ['M6 2h9l5 5v15H6z', 'M14 2v6h6', 'M9 13h6', 'M9 17h4'],
  reports: ['M4 19V9', 'M10 19V5', 'M16 19v-7', 'M22 19H2'],
  settings: ['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2 3.46-.08-.03a1.7 1.7 0 0 0-1.88.34l-.5.29a1.7 1.7 0 0 0-.85 1.62V22h-4v-.08a1.7 1.7 0 0 0-.85-1.62l-.5-.29a1.7 1.7 0 0 0-1.88-.34l-.08.03-2-3.46.06-.06A1.7 1.7 0 0 0 4.6 15v-.58a1.7 1.7 0 0 0-1-1.54L3.5 12.8v-4l.1-.06a1.7 1.7 0 0 0 1-1.54v-.58a1.7 1.7 0 0 0-.34-1.88L4.2 4.68l2-3.46.08.03a1.7 1.7 0 0 0 1.88-.34l.5-.29A1.7 1.7 0 0 0 9.5-.99V-1h4v.08a1.7 1.7 0 0 0 .85 1.62l.5.29a1.7 1.7 0 0 0 1.88.34l.08-.03 2 3.46-.06.06a1.7 1.7 0 0 0-.34 1.88v.58a1.7 1.7 0 0 0 1 1.54l.1.06v4l-.1.06a1.7 1.7 0 0 0-1 1.54z'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.35-4.35'],
  bell: ['M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  plus: ['M12 5v14', 'M5 12h14'],
  download: ['M12 3v12', 'M7 10l5 5 5-5', 'M5 21h14'],
  trend: ['M3 17l6-6 4 4 8-8', 'M14 7h7v7'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
  pin: ['M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z', 'M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  dots: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01'],
  chevron: ['M9 18l6-6-6-6'],
  check: ['M20 6L9 17l-5-5'],
  alert: ['M10.3 2.9 1.8 17a2 2 0 0 0 1.8 3h16.8a2 2 0 0 0 1.8-3l-8.4-14.1a2 2 0 0 0-3.6 0z', 'M12 9v4', 'M12 17h.01'],
  logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9']
  ,mail: ['M4 4h16v16H4z', 'M4 6l8 7 8-7']
  ,lock: ['M5 10h14v11H5z', 'M8 10V7a4 4 0 0 1 8 0v3']
  ,eye: ['M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z']
  ,filter: ['M4 5h16', 'M7 12h10', 'M10 19h4']
  ,star: ['M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3L5.8 21 7 14.2 2 9.3l6.9-1z']
};

@Component({
  selector: 'ui-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      @for (path of paths; track path) { <path [attr.d]="path"></path> }
    </svg>
  `,
  styles: [':host{display:inline-flex;width:20px;height:20px}:host svg{width:100%;height:100%}']
})
export class UiIconComponent {
  @Input({ required: true }) name = 'dashboard';
  get paths(): string[] { return ICONS[this.name] ?? ICONS['dashboard']; }
}
