import { Routes } from '@angular/router';
import { OverviewComponent } from './components/pages/overview/overview.component';
import { TrackingSettingsComponent } from './components/pages/tracking-settings/tracking-settings.component';
import { StatisticsComponent } from './components/pages/statistics/statistics.component';
import { ProfileComponent } from './components/pages/profile/profile.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  { path: 'overview', component: OverviewComponent },
  { path: 'tracking-settings', component: TrackingSettingsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'profile', component: ProfileComponent },
];
