import { Component, ViewEncapsulation } from '@angular/core';
import { StatsTrackerComponent } from '../../stats-tracker/stats-tracker.component';
import { FullCalendarModule } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-overview',
  imports: [StatsTrackerComponent, FullCalendarModule],
  standalone: true,
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class OverviewComponent {
  calendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    dateClick: (info: any) => alert('Clicked: ' + info.dateStr),
    events: [
      { title: 'Событие 1', start: '2025-08-15' },
      { title: 'Событие 2', start: '2025-08-18' },
    ],
    height: 640,
  };
}
