import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

type Lang = 'en' | 'cz';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TranslateModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly buttonsIcon = [
    {
      alt: 'health-icon',
      src: 'assets/icons/app/health_icon.svg',
      route: '',
    },
    {
      alt: 'profile-icon',
      src: 'assets/icons/app/profile_icon.svg',
      route: '/profile',
    },
    {
      alt: 'settings-icon',
      src: 'assets/icons/app/settings_icon.svg',
      route: '/tracking-settings',
    },
  ];

  nextLangLabel$!: Observable<'EN' | 'CZ'>;

  constructor(private readonly translate: TranslateService) {
    const initial = (this.translate.getCurrentLang() as Lang) || 'en';

    this.nextLangLabel$ = this.translate.onLangChange.pipe(
      map((e) => e.lang as Lang),
      startWith(initial),
      map((cur) => (cur === 'en' ? 'CZ' : 'EN')),
    );
  }

  toggleLang() {
    const cur = (this.translate.getCurrentLang() as Lang) || 'en';
    const next: Lang = cur === 'en' ? 'cz' : 'en';
    this.translate.use(next);
    localStorage.setItem('lang', next);
    document.documentElement.lang = next;
  }
}
