import { InputType } from '../../app/core/enums/input-type';
import { Frequency } from '../../app/core/enums/frequency';
import { Tracker } from '../../app/core/models/tracker';
import { TimeOfDay } from '../../app/core/enums/time-of-day';
import { DailyEntries } from '../../app/core/enums/daily-entries';
import { Emoji } from '../../app/core/enums/emoji';
import { Colors } from '../../app/core/enums/colors';

export const StatsDefault: Tracker[] = [
  {
    id: 1,
    name: 'Mood',
    inputType: InputType.EMOJI_SCALE,
    frequency: Frequency.EVERY_DAY,
    timeOfDay: TimeOfDay.AFTERNOON,
    dailyEntries: DailyEntries.ONCE_DAY,
    color: Colors.LIGHT_BLUE,
    emoji: Emoji.BOAT,
    category: [],
    tags: [],
    tracked: true,
    entries: [],
  },
  {
    id: 2,
    name: 'Water intake',
    inputType: InputType.SLIDER,
    frequency: Frequency.EVERY_DAY,
    timeOfDay: TimeOfDay.ALL_DAY,
    dailyEntries: DailyEntries.FREE_ENTRY,
    color: Colors.DARK_LIGHT_BLUE,
    emoji: Emoji.BASKETBALL,
    category: [],
    tags: [],
    tracked: true,
    entries: [],
  },
];
