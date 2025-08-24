import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly buttonsIcon = [
    {
      alt: 'health-icon',
      src: '../../../assets/icons/health-icon.svg',
      route: '',
    },
    {
      alt: 'profile-icon',
      src: '../../../assets/icons/profile-icon.svg',
      route: '/profile',
    },
    {
      alt: 'settings-icon',
      src: '../../../assets/icons/settings-icon.svg',
      route: '',
    },
  ];
}
