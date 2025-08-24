import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe, DecimalPipe } from '@angular/common';

export interface HabitCardData {
  id: number;
  name: string;
  emoji: string;
  series: number;
  lastDay: Date | null;
  completion: number;
}

@Component({
  selector: 'app-habit-card',
  imports: [TranslateModule, DecimalPipe, DatePipe],
  templateUrl: './habit-card.component.html',
  styleUrl: './habit-card.component.css',
})
export class HabitCardComponent {
  @Input({ required: true }) habit!: HabitCardData;
}
