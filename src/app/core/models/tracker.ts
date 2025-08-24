import { InputType } from '../enums/input-type';
import { Frequency } from '../enums/frequency';
import { TimeOfDay } from '../enums/time-of-day';
import { DailyEntries } from '../enums/daily-entries';
import { Category } from './category';
import { Tag } from './tag';
import { Colors } from '../enums/colors';
import { Emoji } from '../enums/emoji';

export interface Tracker {
  id: number;
  name: string;
  inputType: InputType;
  options?: OptionsInputType[];
  frequency: Frequency;
  timeOfDay: TimeOfDay;
  dailyEntries: DailyEntries;
  color: Colors;
  emoji: Emoji;
  category: Category[];
  tags: Tag[];
  tracked: boolean;
  entries: StatEntry[];
}

export interface StatEntry<V = number | string | boolean | string[]> {
  date: string;
  value: V;
}

export interface OptionsInputType<V = string> {
  id: number;
  value: V;
}
