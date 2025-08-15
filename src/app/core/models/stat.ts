import { InputType } from '../enums/input-type';
import { Frequency } from '../enums/frequency';
import { TimeOfDay } from '../enums/time-of-day';
import { DailyEntries } from '../enums/daily-entries';
import { Category } from './category';
import { Tag } from './tag';

export interface Stat {
  id: number;
  name: string;
  inputType: InputType;
  frequency: Frequency;
  timeOfDay: TimeOfDay;
  dailyEntries: DailyEntries;
  color: string;
  icon: string;
  category: Category[];
  tags: Tag[];
  privacy: boolean;
}
