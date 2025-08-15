import { Stat } from './stat';

export interface User {
  id: number;
  name: string;
  lastname: string;
  birthdate: string;
  login: string;
  password: string;
  healthTracker: Stat[];
}
