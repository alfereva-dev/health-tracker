import { InputType } from '../../app/core/enums/input-type';
import { Frequency } from '../../app/core/enums/frequency';
import { Stat } from '../../app/core/models/stat';
import { TimeOfDay } from '../../app/core/enums/time-of-day';
import { DailyEntries } from '../../app/core/enums/daily-entries';

export const StatsDefault: Stat[] = [
  {
    id: 1,
    name: 'Mood',
    inputType: InputType.EMOJI_SCALE,
    frequency: Frequency.EVERY_DAY,
    timeOfDay: TimeOfDay.AFTERNOON,
    dailyEntries: DailyEntries.ONCE_DAY,
    color: '#FFC107',
    icon: 'smiley.svg',
    category: [],
    tags: [],
    privacy: false,
  },
  {
    id: 2,
    name: 'Water intake',
    inputType: InputType.SLIDER,
    frequency: Frequency.EVERY_DAY,
    timeOfDay: TimeOfDay.ALL_DAY,
    dailyEntries: DailyEntries.FREE_ENTRY,
    color: '#2196F3',
    icon: 'water.svg',
    category: [],
    tags: [],
    privacy: false,
  },
];
