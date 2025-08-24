import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  delay,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  throwError,
} from 'rxjs';
import { User } from '../models/user';
import { Stat } from '../models/stat';
import { MockUsers } from '../../../assets/mock/user';
import { Entry } from '../models/tracker.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly STORAGE_PREFIX: string = 'user';
  private readonly LATENCY_MS = 200;
  private readonly store = new BehaviorSubject<User | null>(null);

  login(userId: number, opts: { reset?: boolean } = {}): Observable<User> {
    const fromStorage = opts.reset ? null : this.readFromStorage(userId);
    const user = fromStorage ?? this.seedFromMock(userId);
    this.store.next(user);
    return of(user).pipe(delay(this.LATENCY_MS));
  }

  logout(clearStorage = false) {
    const cur = this.store.value;
    if (clearStorage && cur) localStorage.removeItem(this.key(cur.id));
    this.store.next(null);
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.store.asObservable().pipe(
      map((u) => !!u),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  get user$(): Observable<User> {
    return this.store.asObservable().pipe(
      filter((u): u is User => !!u),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  get snapshot(): User | null {
    return this.store.value;
  }

  updateUser(patch: Partial<User>): Observable<User> {
    const cur = this.requireUser();
    const update: User = { ...cur, ...patch };
    this.persist(update);
    this.store.next(update);
    return of(update).pipe(delay(this.LATENCY_MS));
  }

  getHealthTrackers$(): Observable<Stat[]> {
    return this.user$.pipe(map((u) => u.healthTracker ?? []));
  }

  getHealthTrackerById$(trackerId: number): Observable<Stat | undefined> {
    return this.getHealthTrackers$().pipe(
      map((list) => list.find((t) => t.id === trackerId)),
    );
  }

  addHealthTracker(newTracker: Stat): Observable<Stat> {
    const u = this.requireUser();
    const next: User = {
      ...u,
      healthTracker: [...u.healthTracker, newTracker],
    };
    this.persist(next);
    this.store.next(next);
    return of(newTracker).pipe(delay(this.LATENCY_MS));
  }

  updateHealthTracker(
    trackerId: number,
    patch: Partial<Stat>,
  ): Observable<Stat> {
    const u = this.requireUser();
    const list = u.healthTracker.map((t) =>
      t.id === trackerId ? { ...t, ...patch } : t,
    );
    const update = list.find((t) => t.id === trackerId);
    if (!update) return throwError(() => new Error('Tracker not found'));
    const next: User = { ...u, healthTracker: list };
    this.persist(next);
    this.store.next(next);
    return of(update).pipe(delay(this.LATENCY_MS));
  }

  removeHealthTracker(trackerId: number): Observable<void> {
    const u = this.requireUser();
    const list = u.healthTracker.filter((t) => t.id === trackerId);
    const next: User = { ...u, healthTracker: list };
    this.persist(next);
    this.store.next(next);
    return of(void 0).pipe(delay(this.LATENCY_MS));
  }

  addEntry(trackerId: number, entry: Entry): Observable<Stat> {
    const u = this.requireUser();
    const list = u.healthTracker.map((t) =>
      t.id === trackerId
        ? { ...t, entries: [...((t as any).entries ?? []), entry] }
        : t,
    );
    const updated = list.find((t) => t.id === trackerId)!;
    const next: User = { ...u, healthTracker: list };
    this.persist(next);
    this.store.next(next);
    return of(updated).pipe(delay(this.LATENCY_MS));
  }

  updateEntry(
    trackerId: number,
    date: string,
    patch: Partial<Entry>,
  ): Observable<Stat> {
    const u = this.requireUser();
    const list = u.healthTracker.map((t) => {
      if (t.id !== trackerId) return t;
      const entries: Entry[] = ((t as any).entries ?? []).map((e: Entry) =>
        e.date === date ? { ...e, ...patch } : e,
      );
      return { ...t, entries };
    });
    const updated = list.find((t) => t.id === trackerId)!;
    const next: User = { ...u, healthTracker: list };
    this.persist(next);
    this.store.next(next);
    return of(updated).pipe(delay(this.LATENCY_MS));
  }

  removeEntry(trackerId: number, date: string): Observable<Stat> {
    const u = this.requireUser();
    const list = u.healthTracker.map((t) => {
      if (t.id !== trackerId) return t;
      const entries: Entry[] = ((t as any).entries ?? []).filter(
        (e: Entry) => e.date !== date,
      );
      return { ...t, entries };
    });
    const updated = list.find((t) => t.id === trackerId)!;
    const next: User = { ...u, healthTracker: list };
    this.persist(next);
    this.store.next(next);
    return of(updated).pipe(delay(this.LATENCY_MS));
  }

  private key(id: number) {
    return `${this.STORAGE_PREFIX}${id}`;
  }

  resetToMock(userId: number): Observable<User> {
    const seeded = this.seedFromMock(userId);
    this.store.next(seeded);
    return of(seeded).pipe(delay(this.LATENCY_MS));
  }

  private persist(u: User) {
    localStorage.setItem(this.key(u.id), JSON.stringify(u));
  }

  private readFromStorage(userId: number): User | null {
    const raw = localStorage.getItem(this.key(userId));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private seedFromMock(userId: number): User {
    const mock = MockUsers.find((u) => u.id === userId);
    if (!mock) throw new Error(`Mock user ${userId} not found`);
    const copy = this.clone(mock);
    this.persist(copy);
    return copy;
  }

  private requireUser(): User {
    const u = this.store.value;
    if (!u) throw new Error('User is not loaded.');
    return u;
  }

  private clone<T>(obj: T): T {
    if (typeof structuredClone === 'function') return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
  }
}
