import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SelectedStatsStore {
  private readonly _selected = signal<Set<number>>(new Set<number>());
  readonly selectedIds = computed(() => [...this._selected()].sort());

  initFromStorage(key = 'selectedStats') {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const ids = JSON.parse(raw) as number[];
      this._selected.set(new Set(ids));
    } catch {}
  }

  saveToStorage(key = 'selectedStats') {
    localStorage.setItem(key, JSON.stringify(this.selectedIds()));
  }

  has(id: number) {
    return this._selected().has(id);
  }

  select(id: number) {
    if (this.has(id)) return;
    const next = new Set(this._selected());
    next.add(id);
    this._selected.set(next);
  }

  unselect(id: number) {
    if (!this.has(id)) return;
    const next = new Set(this._selected());
    next.delete(id);
    this._selected.set(next);
  }

  toggle(id: number) {
    this.has(id) ? this.unselect(id) : this.select(id);
  }

  setAll(ids: number[]) {
    this._selected.set(new Set(ids));
  }
}
