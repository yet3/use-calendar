import { Dispatch, SetStateAction } from 'react';
import { Locale } from 'date-fns';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type Unit = 'days' | 'months' | 'years' | 'weeks';
type FormatFunc = (pattern?: string, options?: FormatOptions) => string;

export interface UseCalendarOptions {
  defaultDate?: Date | null | false;

  calendarStartDay?: DayOfWeek;

  disabled?: boolean;

  disableWeekDays?: boolean;
  disableWeekends?: boolean;

  alwaysSixRows?: boolean;

  locale?: Locale;

  dayOfWeekFormat?: string;
  dayFormat?: string;
  calendarDateFormat?: string;
}

export interface UseCalendarHookOptions extends UseCalendarOptions { }

export interface IUseCalendar {
  DEFAULT_OPTIONS: Required<UseCalendarOptions>;
  options: UseCalendarOptions;
  setLocale: (locale: Locale) => void;
  setOptions(options: Partial<UseCalendarOptions>): void;
  setCalendarStartDay(day: DayOfWeek): void;
  resetOptions(): void;
}


export interface FormatOptions {
  locale?: Locale;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  firstWeekContainsDate?: number;
  useAdditionalWeekYearTokens?: boolean;
  useAdditionalDayOfYearTokens?: boolean;
}

export interface CalendarGroup {
  day: number;
  isoDay: number;

  // https://date-fns.org/v2.29.1/docs/format
  format: FormatFunc;

  week: number;
  isoWeek: number;

  days: CalendarDay[];

  key: string;
}

export interface CalendarDay {
  dayOfMonth: number;
  day: number;
  isoDay: number;

  date: Date;

  // https://date-fns.org/v2.29.1/docs/format
  format: FormatFunc;
  isWeekDay?: boolean;

  isWeekend?: boolean;

  isCurrentMonth?: boolean;
  isPrevMonth?: boolean;
  isNextMonth?: boolean;

  isDisabled?: boolean;

  key: string;
}

export interface CalendarDayOfWeek {
  day: number;
  date: Date;
  // https://date-fns.org/v2.29.1/docs/format
  format: FormatFunc;
}

export interface CalendarDate {
    date: Date;

    // https://date-fns.org/v2.29.1/docs/format
    format: FormatFunc;

    set: Dispatch<SetStateAction<Date>>;
    add: (amt: number, unit: Unit) => void;
    subtract: (amt: number, unit: Unit) => void;
    addMonth: () => void;
    subtractMonth: () => void;
    addYear: () => void;
    subtractYear: () => void;
}

export interface UseCalendarResult {
  calendarDate: CalendarDate
  calendarStartDate: {
    date: Date;

    // https://date-fns.org/v2.29.1/docs/format
    format: FormatFunc;
  };
  calendarEndDate: {
    date: Date;

    // https://date-fns.org/v2.29.1/docs/format
    format: FormatFunc;
  };
  daysOfWeek: CalendarDayOfWeek[];
  days: CalendarDay[];
  groupedDays: CalendarGroup[];

  isDisabled: boolean;
}
