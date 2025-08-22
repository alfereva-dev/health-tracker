import { InputType } from '../../app/core/enums/input-type';
import { User } from '../../app/core/models/user';
import { Frequency } from '../../app/core/enums/frequency';
import { TimeOfDay } from '../../app/core/enums/time-of-day';
import { DailyEntries } from '../../app/core/enums/daily-entries';
import { Colors } from '../../app/core/enums/colors';
import { Emoji } from '../../app/core/enums/emoji';

export const MockUsers: User[] = [
  {
    id: 1,
    name: 'Anna',
    lastname: 'Wolf',
    birthdate: '1995-04-12',
    login: 'anna_iv',
    password: 'securePass123',
    healthTracker: [
      {
        id: 0,
        name: 'Daily Water Intake',
        inputType: InputType.SLIDER,
        frequency: Frequency.EVERY_DAY,
        timeOfDay: TimeOfDay.ALL_DAY,
        dailyEntries: DailyEntries.SEVERAL_TIMES_DAY,
        color: Colors.BLUE,
        emoji: Emoji.BLUE_SQUARE,
        category: [{ id: 1, name: 'Hydration' }],
        tags: [
          { id: 1, name: 'health' },
          { id: 2, name: 'fitness' },
        ],
        privacy: false,
        entries: [
          { date: '2025-08-18', value: 2 },
          { date: '2025-08-19', value: 3 },
          { date: '2025-08-20', value: 3 },
          { date: '2025-08-21', value: 3 },
        ],
      },
      {
        id: 1,
        name: 'Morning Mood',
        inputType: InputType.EMOJI_SCALE,
        frequency: Frequency.EVERY_DAY,
        timeOfDay: TimeOfDay.MORNING,
        dailyEntries: DailyEntries.ONCE_DAY,
        color: Colors.DARK_ORANGE,
        emoji: Emoji.SMILE,
        category: [{ id: 2, name: 'Mental Health' }],
        tags: [
          { id: 3, name: 'mood' },
          { id: 4, name: 'wellbeing' },
        ],
        privacy: true,
        entries: [
          { date: '2025-08-18', value: 9 },
          { date: '2025-08-19', value: 8 },
          { date: '2025-08-20', value: 8 },
          { date: '2025-08-21', value: 8 },
        ],
      },
      {
        id: 2,
        name: 'Steps Count',
        inputType: InputType.NUMBER,
        frequency: Frequency.EVERY_DAY,
        timeOfDay: TimeOfDay.ALL_DAY,
        dailyEntries: DailyEntries.FREE_ENTRY,
        color: Colors.PINK,
        emoji: Emoji.MAN_RUN,
        category: [{ id: 3, name: 'Activity' }],
        tags: [
          { id: 5, name: 'walking' },
          { id: 6, name: 'cardio' },
        ],
        privacy: false,
        entries: [
          { date: '2025-08-18', value: 15876 },
          { date: '2025-08-19', value: 16777 },
          { date: '2025-08-20', value: 16777 },
          { date: '2025-08-21', value: 16777 },
        ],
      },
    ],
  },
];
