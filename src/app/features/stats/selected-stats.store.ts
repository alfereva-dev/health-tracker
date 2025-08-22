import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SelectedStatsStore {
  private readonly _selected = signal<Set<number>>(new Set<number>());
  readonly selectedIds = computed(() => [...this._selected()].sort());

  constructor() {
    this.initFromStorage();
  }

  initFromStorage(key = 'selectedStats') {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      this._selected.set(new Set(JSON.parse(raw) as number[]));
    } catch {}
  }

  saveToStorage(key = 'selectedStats') {
    localStorage.setItem(key, JSON.stringify(this.selectedIds()));
  }

  has(id: number) {
    return this._selected().has(id);
  }

  select(id: number) {
    const s = new Set(this._selected());
    s.add(id);
    this._selected.set(s);
  }

  unselect(id: number) {
    const s = new Set(this._selected());
    s.delete(id);
    this._selected.set(s);
  }
}
