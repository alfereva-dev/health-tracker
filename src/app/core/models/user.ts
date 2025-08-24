import { Tracker } from './tracker';
import { Category } from './category';
import { Tag } from './tag';

export interface User {
  id: number;
  name: string;
  lastname: string;
  birthdate: string;
  login: string;
  password: string;
  avatarUrl?: string;
  category: Category[];
  tags: Tag[];
  healthTracker: Tracker[];
}
