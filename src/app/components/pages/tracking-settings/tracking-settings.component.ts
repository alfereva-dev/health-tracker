import { Component, computed, inject, signal } from '@angular/core';
import { StatsTrackerComponent } from '../../tracking/stats-tracker/stats-tracker.component';
import { TranslateModule } from '@ngx-translate/core';
import { Tracker } from '../../../core/models/tracker';
import { SelectedStatsStore } from '../../../features/stats/selected-stats.store';
import { CreateNewTrackerComponent } from '../../tracking/create-new-tracker/create-new-tracker.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../../core/services/user.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-tracking-settings',
  standalone: true,
  imports: [StatsTrackerComponent, TranslateModule, CreateNewTrackerComponent],
  templateUrl: './tracking-settings.component.html',
  styleUrl: './tracking-settings.component.css',
})
export class TrackingSettingsComponent {
  private readonly store = inject(SelectedStatsStore);
  private readonly userService = inject(UserService);

  readonly trackers = toSignal(
    this.userService.user$.pipe(
      map((u) => u?.healthTracker ?? ([] as Tracker[])),
    ),
    { initialValue: [] as Tracker[] },
  );

  readonly selectedList = computed(() =>
    this.trackers().filter((t) => t.tracked),
  );
  readonly unselectedList = computed(() =>
    this.trackers().filter((t) => !t.tracked),
  );

  isCreateOpen = signal(false);

  select(id: number) {
    this.userService.updateHealthTracker(id, { tracked: true }).subscribe();
  }

  unselect(id: number) {
    this.userService.updateHealthTracker(id, { tracked: false }).subscribe();
  }

  createNewStat() {
    this.isCreateOpen.set(true);
  }

  closeCreate() {
    this.isCreateOpen.set(false);
  }
}
