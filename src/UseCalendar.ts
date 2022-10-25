import enUS from 'date-fns/locale/en-US';
import { IUseCalendar } from './types';

export const UseCalendar: IUseCalendar = function() { };

UseCalendar.DEFAULT_OPTIONS = {
  defaultDate: null,
  locale: enUS,

  calendarStartDay: 'monday',

  disabled: false,

  disableWeekDays: false,
  disableWeekends: false,

  alwaysSixRows: false,

  dayFormat: 'dd',
  dayOfWeekFormat: 'EEEEEE',
  calendarDateFormat: 'MM-yyyy',
  onlyCurrentMonth: false,
};

UseCalendar.options = { ...UseCalendar.DEFAULT_OPTIONS };
UseCalendar.setLocale = function(locale: Locale) {
  if (!locale) return;
  this.options.locale = locale;
};

UseCalendar.setOptions = function(opts) {
  this.options = { ...this.options, ...opts };
};

UseCalendar.setCalendarStartDay = function(day) {
  if (!day) return;
  this.options.calendarStartDay = day;
};

UseCalendar.resetOptions = function() {
  this.options = { ...UseCalendar.DEFAULT_OPTIONS };
};
