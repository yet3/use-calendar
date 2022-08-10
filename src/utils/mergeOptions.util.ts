import { Locale } from 'date-fns';
import { DayOfWeek, UseCalendarHookOptions, UseCalendarOptions } from '../types';
import { UseCalendar } from '../UseCalendar';

interface MergedOptions extends UseCalendarOptions {
  calendarStartDay: DayOfWeek;
  locale: Locale;

  dayOfWeekFormat: string;
  dayFormat: string;
  calendarDateFormat: string;
}

const mergeOptions = (hOptions: UseCalendarHookOptions): MergedOptions => {
  return {
    dayFormat: UseCalendar.DEFAULT_OPTIONS.dayFormat,
    dayOfWeekFormat: UseCalendar.DEFAULT_OPTIONS.dayOfWeekFormat,
    calendarDateFormat: UseCalendar.DEFAULT_OPTIONS.calendarDateFormat,
    locale: UseCalendar.DEFAULT_OPTIONS.locale,
    calendarStartDay: UseCalendar.DEFAULT_OPTIONS.calendarStartDay,
    ...UseCalendar.options,
    ...hOptions,
  };
};

export { mergeOptions };
