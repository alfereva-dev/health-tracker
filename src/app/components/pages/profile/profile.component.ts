import { Component, computed, signal } from '@angular/core';
import { AvatarService } from '../../../core/services/avatar.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user';
import { InputType } from '../../../core/enums/input-type';
import { FormFieldComponent } from '../../ui/form-field/form-field.component';
import { format, parseISO, subDays } from 'date-fns';
import { FormField } from '../../../core/models/form-field';
import {
  InfoboxComponent,
  InfoboxData,
} from '../../ui/infobox/infobox.component';
import { Entry } from '../../../core/models/tracker.model';

@Component({
  selector: 'app-profile',
  imports: [FormFieldComponent, InfoboxComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  busy = signal(false);
  error = signal<string | null>(null);
  public user!: User;
  formFields: FormField[] = [];
  private userSig = signal<User | null>(null);

  constructor(
    public avatar: AvatarService,
    private readonly userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.user$.subscribe({
      next: (detail) => {
        this.user = detail;
        this.userSig.set(detail);
        this.avatar.load(detail);
        this.updateDetails();
      },
    });
  }

  private formatBirthdateForUi(birthdate: string) {
    const d = parseISO(birthdate);
    return format(d, 'dd.MM.yyyy');
  }

  private updateDetails() {
    const date = this.formatBirthdateForUi(this.user.birthdate);
    this.formFields = [
      {
        label: 'USER.login',
        type: InputType.INFO_TEXT,
        value: this.user.login,
      },
      {
        label: 'USER.birthdate',
        type: InputType.INFO_TEXT,
        value: date,
      },
      {
        label: 'USER.count_track',
        type: InputType.INFO_TEXT,
        value: this.user.healthTracker.length,
      },
    ];
  }

  private currentStreak(entries: Entry[]): number {
    const set = new Set(entries.map((e) => e.date));
    if (set.size === 0) return 0;

    const lastKey = [...set].sort().pop()!;
    let cur = parseISO(lastKey);
    let streak = 0;
    while (set.has(format(cur, 'yyyy-MM-dd'))) {
      streak++;
      cur = subDays(cur, 1);
    }
    return streak;
  }

  readonly topDaysInfo = computed<InfoboxData>(() => {
    const user = this.userSig();
    if (!user) return { label: 'TITLE.top_days', rows: [] };

    const perDay = new Map<string, Set<string>>();
    for (const t of user.healthTracker) {
      const emoji = String((t as any).emoji);
      const entries = ((t as any).entries ?? []) as Entry[];
      const seen = new Set<string>();

      for (const e of entries) {
        const key = e.date;
        if (seen.has(key)) continue;
        seen.add(key);
        if (!perDay.has(key)) perDay.set(key, new Set());
        perDay.get(key)!.add(emoji);
      }
    }

    const rows = Array.from(perDay, ([date, set]) => ({
      date,
      emojis: [...set],
    }))
      .sort((a, b) => {
        const byCount = b.emojis.length - a.emojis.length;
        if (byCount !== 0) return byCount;
        return b.date.localeCompare(a.date);
      })
      .slice(0, 3)
      .map(({ date, emojis }) => ({
        label: format(parseISO(date), 'dd.MM.yyyy'),
        value: emojis.join(' '),
      }));
    return {
      label: 'TITLE.top_days',
      rows,
    };
  });

  readonly topTrackersInfo = computed<InfoboxData>(() => {
    const user = this.userSig();
    if (!user) return { label: 'TITLE.top_trackers', rows: [] };

    const rows = user.healthTracker
      .map((t) => {
        const entries = ((t as any).entries ?? []) as Entry[];
        const streak = this.currentStreak(entries);
        return {
          label: `${t.name} ${String((t as any).emoji)}`,
          value: String(streak),
          _num: streak,
        };
      })
      .filter((x) => x._num > 0)
      .sort((a, b) => b._num - a._num)
      .slice(0, 3)
      .map(({ label, value }) => ({ label, value }));
    return {
      label: 'TITLE.top_trackers',
      rows,
    };
  });

  async onAvatarChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.error.set(null);
    this.busy.set(true);
    try {
      await this.avatar.setFromFile(this.user, file);
    } catch (e: any) {
      this.error.set(e.message ?? 'Upload error');
    } finally {
      this.busy.set(false);
      input.value = '';
    }
  }

  onRemoveAvatar() {
    this.avatar.remove(this.user.id);
  }
}
