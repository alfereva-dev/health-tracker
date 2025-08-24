import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatsTrackerComponent } from './components/tracking/stats-tracker/stats-tracker.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { OverviewComponent } from './components/pages/overview/overview.component';
import { NavigationBarComponent } from './components/layout/navigation-bar/navigation-bar.component';
import { TranslateService } from '@ngx-translate/core';
import { TrackingSettingsComponent } from './components/pages/tracking-settings/tracking-settings.component';
import { StatisticsComponent } from './components/pages/statistics/statistics.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { UserService } from './core/services/user.service';

type Lang = 'en' | 'cz';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    StatsTrackerComponent,
    HeaderComponent,
    OverviewComponent,
    NavigationBarComponent,
    TrackingSettingsComponent,
    StatisticsComponent,
    ProfileComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'client';

  constructor(
    private readonly translate: TranslateService,
    public userService: UserService,
  ) {}

  ngOnInit() {
    this.translate.addLangs(['en', 'cz']);
    this.translate.setFallbackLang('en');

    const supported: Lang[] = ['en', 'cz'];
    const saved = localStorage.getItem('lang') as Lang | null;
    const browser = this.translate.getBrowserLang() as Lang | undefined;

    const initial: Lang =
      (saved && supported.includes(saved) && saved) ||
      (browser && supported.includes(browser) && browser) ||
      'en';

    this.translate.use(initial);
    document.documentElement.lang = initial;

    this.userService.login(1, { reset: true }).subscribe();
  }
}
