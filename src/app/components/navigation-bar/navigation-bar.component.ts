import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { JsonPipe } from '@angular/common';

type NavButton = { key: string; route: string };

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [TranslateModule, RouterModule, JsonPipe],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css'],
})
export class NavigationBarComponent {
  active: string | null = 'MENU.overview';

  readonly navButtons: NavButton[] = [
    { key: 'MENU.overview', route: '/overview' },
    { key: 'MENU.tracking_settings', route: '/tracking-settings' },
    { key: 'MENU.statistics', route: '/statistics' },
    { key: 'MENU.profile', route: '/profile' },
  ];
}
