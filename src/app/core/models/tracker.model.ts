export type Entry = { date: string; value: number | string | boolean };

export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export type Tracker = {
  id: number;
  name: string;
  emoji: string;
  entries: Entry[];
};

export type DaySummary = {
  date: string;
  day: number;
  icons: string[];
  hits: { trackerId: number; value: Entry['value'] }[];
};
