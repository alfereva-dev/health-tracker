import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
} from 'date-fns';
import { DaySummary, Tracker } from '../../core/models/tracker.model';

export function buildMonthSummary(
  trackers: Tracker[],
  targetMonth: Date,
): DaySummary[] {
  const start = startOfMonth(targetMonth);
  const end = endOfMonth(targetMonth);

  const days = eachDayOfInterval({ start, end }).map<DaySummary>((d) => ({
    date: format(d, 'yyyy-MM-dd'),
    day: Number(format(d, 'd')),
    icons: [],
    hits: [],
  }));

  const byDate = new Map<string, DaySummary>(days.map((d) => [d.date, d]));

  for (const t of trackers) {
    for (const e of t.entries ?? []) {
      const d = parseISO(e.date);
      if (!isSameMonth(d, targetMonth)) continue;

      const key = format(d, 'yyyy-MM-dd');
      const day = byDate.get(key);
      if (!day) continue;

      let ok: boolean;

      switch (typeof e.value) {
        case 'number':
          ok = e.value > 0;
          break;
        case 'boolean':
          ok = e.value;
          break;
        default:
          ok = String(e.value).trim().length > 0;
      }

      if (ok) {
        day.icons.push(t.emoji);
        day.hits.push({ trackerId: t.id, value: e.value });
      }
    }
  }

  return days;
}
