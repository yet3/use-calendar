import { DayOfWeek } from '../types';

export const DAYS_OF_WEEK: { [key in DayOfWeek]: 0 | 1 | 2 | 3 | 4 | 5 | 6 } = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};
