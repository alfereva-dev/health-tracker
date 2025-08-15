import { InputType } from '../../app/core/enums/input-type';
import { User } from '../../app/core/models/user';
import { Frequency } from '../../app/core/enums/frequency';
import { TimeOfDay } from '../../app/core/enums/time-of-day';
import { DailyEntries } from '../../app/core/enums/daily-entries';

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
        color: '#4CAF50',
        icon: 'water-drop.svg',
        category: [{ id: 1, name: 'Hydration' }],
        tags: [
          { id: 1, name: 'health' },
          { id: 2, name: 'fitness' },
        ],
        privacy: false,
      },
      {
        id: 1,
        name: 'Morning Mood',
        inputType: InputType.EMOJI_SCALE,
        frequency: Frequency.EVERY_DAY,
        timeOfDay: TimeOfDay.MORNING,
        dailyEntries: DailyEntries.ONCE_DAY,
        color: '#FFC107',
        icon: 'smiley.svg',
        category: [{ id: 2, name: 'Mental Health' }],
        tags: [
          { id: 3, name: 'mood' },
          { id: 4, name: 'wellbeing' },
        ],
        privacy: true,
      },
      {
        id: 2,
        name: 'Steps Count',
        inputType: InputType.NUMBER,
        frequency: Frequency.EVERY_DAY,
        timeOfDay: TimeOfDay.ALL_DAY,
        dailyEntries: DailyEntries.FREE_ENTRY,
        color: '#2196F3',
        icon: 'footsteps.svg',
        category: [{ id: 3, name: 'Activity' }],
        tags: [
          { id: 5, name: 'walking' },
          { id: 6, name: 'cardio' },
        ],
        privacy: false,
      },
    ],
  },
];
