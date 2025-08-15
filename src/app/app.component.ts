import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StatsTrackerComponent } from './components/stats-tracker/stats-tracker.component';
import { HeaderComponent } from './components/header/header.component';
import { OverviewComponent } from './components/pages/overview/overview.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { TranslateService } from '@ngx-translate/core';
import { TrackingSettingsComponent } from './components/pages/tracking-settings/tracking-settings.component';
import { StatisticsComponent } from './components/pages/statistics/statistics.component';
import { ProfileComponent } from './components/pages/profile/profile.component';

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

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'cz']);
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
