import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  readonly avatarUrl = signal<string | null>(null);
  private readonly key = (userId: number) => `avatar:${userId}`;

  load(user: User) {
    const fromLS = localStorage.getItem(this.key(user.id));
    this.avatarUrl.set(fromLS ?? user.avatarUrl ?? null);
  }

  async setFromFile(user: User, file: File) {
    this.validate(file);
    const dataUrl = await this.fileToDataURL(file);
    localStorage.setItem(this.key(user.id), dataUrl);
    this.avatarUrl.set(dataUrl);
    user.avatarUrl = dataUrl;
    return dataUrl;
  }

  setFromUrl(user: User, url: string | null) {
    if (url) {
      localStorage.setItem(this.key(user.id), url);
      this.avatarUrl.set(url);
      user.avatarUrl = url;
    } else {
      this.remove(user.id);
    }
  }

  remove(userId: number) {
    localStorage.removeItem(this.key(userId));
    this.avatarUrl.set(null);
  }

  private validate(file: File) {
    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type.');
    }
    const maxMb = 5;
    if (file.size > maxMb * 1024 * 1024) {
      throw new Error('Invalid file size (> ${maxMb} MB).');
    }
  }

  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result;
        if (typeof res === 'string') {
          resolve(res);
        } else {
          reject(new Error(`Unexpected FileReader result type.`));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
