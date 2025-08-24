import {
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { StatsTrackerComponent } from '../../tracking/stats-tracker/stats-tracker.component';
import { FullCalendarModule } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserService } from '../../../core/services/user.service';
import { Tracker } from '../../../core/models/tracker';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CalendarOptions, EventInput } from '@fullcalendar/core';

@Component({
  selector: 'app-overview',
  imports: [StatsTrackerComponent, FullCalendarModule],
  standalone: true,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent {
  private readonly userService = inject(UserService);
  readonly trackers = toSignal(
    this.userService
      .getHealthTrackers$()
      .pipe(map((list) => list ?? ([] as Tracker[]))),
    { initialValue: [] as Tracker[] },
  );
  readonly selectedDate = signal<string | null>(null);
  readonly calendarEvents = computed<EventInput[]>(() => {
    const countByDate = new Map<string, number>();

    for (const t of this.trackers()) {
      const entries = t.entries ?? [];
      for (const e of entries) {
        const d = e.date;
        countByDate.set(d, (countByDate.get(d) ?? 0) + 1);
      }
    }

    return [...countByDate.entries()].map(([date, count]) => ({
      title: `Trackers: ${count}`,
      start: date,
      allDay: true,
      extendedProps: { date, count },
    }));
  });

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    dateClick: (info) => this.onDateClick(info.dateStr),
    events: [],
    height: 640,
  };

  constructor() {
    effect(() => {
      this.calendarOptions.events = this.calendarEvents();
    });
  }

  private onDateClick(dateStr: string) {
    this.selectedDate.set(dateStr);
  }
}
