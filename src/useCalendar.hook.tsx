import { add, startOfMonth, format, getWeek, getISOWeek, getDaysInMonth } from 'date-fns';
import { useState, useMemo } from 'react';
import {
  CalendarDay,
  CalendarDayOfWeek,
  CalendarGroup,
  FormatOptions,
  Unit,
  UseCalendarHookOptions,
  UseCalendarResult,
} from './types';
import { DAYS_OF_WEEK } from './utils/daysOfWeek.const';
import { mergeOptions } from './utils/mergeOptions.util';
import { sortByDayOfWeek } from './utils/sortByDayOfWeek.util';

const useCalendar = (hOptions: UseCalendarHookOptions = {}): UseCalendarResult => {
  const {
    defaultDate,
    calendarStartDay,
    disabled,
    disableWeekDays,
    disableWeekends,
    alwaysSixRows,
    locale,
    dayFormat,
    dayOfWeekFormat,
    onlyCurrentMonth,
    calendarDateFormat,
    calendarDate: controlledDate,
    setCalendarDate: setControlledDate,
  } = mergeOptions(hOptions);
  const calendarStartDayDate = DAYS_OF_WEEK[calendarStartDay];

  const [calendarDate, setCalendarDate] = useState<Date>(defaultDate || new Date());
  const selectedDate = controlledDate ? controlledDate : calendarDate;
  const setSelectedDate = typeof setControlledDate === 'function' ? setControlledDate : setCalendarDate;

  const addToDate = (amt: number, unit: Unit) => {
    setSelectedDate((p) =>
      add(p, {
        [unit]: amt,
      })
    );
  };

  const formatDate = (date: Date, pattern: string, opts?: FormatOptions) => {
    return format(date, pattern, { locale, weekStartsOn: calendarStartDayDate, ...opts });
  };

  const days = useMemo(() => {
    const days: CalendarDay[] = [];
    const monthStartDate = startOfMonth(selectedDate);
    const firstDay = monthStartDate.getDay();
    let amtOfDaysInCurrentMonth = getDaysInMonth(monthStartDate);

    let loopStartIndex: number;
    let amtOfDays;
    if (!onlyCurrentMonth) {
      if (firstDay === calendarStartDayDate) loopStartIndex = 0;
      else if (firstDay > calendarStartDayDate) loopStartIndex = -(firstDay - calendarStartDayDate);
      else loopStartIndex = -(7 - calendarStartDayDate + firstDay);

      if (alwaysSixRows && !onlyCurrentMonth) amtOfDays = 6 * 7;
      else amtOfDays = Math.ceil((Math.abs(loopStartIndex) + amtOfDaysInCurrentMonth) / 7) * 7;
    } else {
      loopStartIndex = 0;
      amtOfDays = amtOfDaysInCurrentMonth;
    }

    const iterations = amtOfDays + loopStartIndex;
    for (let i = loopStartIndex; i < iterations; i++) {
      const dayDate = add(monthStartDate, { days: i });

      const isPrevMonth = i < 0;
      const isNextMonth = i >= amtOfDaysInCurrentMonth;
      const day = dayDate.getDay();
      const isWeekDay = day !== 0 && day !== 6;
      const dayOfMonth = dayDate.getDate();
      days.push({
        dayOfMonth,
        day,
        isoDay: day === 0 ? 7 : day,

        date: dayDate,
        format: (pattern = dayFormat, opts) => formatDate(dayDate, pattern, opts),

        isWeekDay,
        isWeekend: !isWeekDay,

        isPrevMonth,
        isCurrentMonth: !isPrevMonth && !isNextMonth,
        isNextMonth,

        isDisabled: disabled || (isWeekDay && disableWeekDays) || (!isWeekDay && disableWeekends),

        key: `${dayOfMonth}-${dayDate.getMonth()}-${dayDate.getFullYear()}`,
      });
    }

    return days;
  }, [
    selectedDate,
    calendarStartDay,
    disabled,
    locale?.code,
    dayFormat,
    disableWeekDays,
    disableWeekends,
    alwaysSixRows,
    onlyCurrentMonth,
  ]);

  const groupedDays = useMemo((): CalendarGroup[] => {
    const groups: CalendarGroup[] = [];

    let prevDayOfWeek = -1;
    days
      .slice()
      .sort((a, b) => a.day - b.day)
      .forEach((day) => {
        if (prevDayOfWeek !== day.day) {
          const week = getWeek(day.date);
          prevDayOfWeek = day.day;
          groups.push({
            day: day.day,
            isoDay: day.isoDay,

            days: [day],
            week,

            isoWeek: getISOWeek(day.date),

            format: (pattern = dayOfWeekFormat, options) => formatDate(day.date, pattern, options),

            key: `${day.day}-${week}-${day.date.getFullYear()}`,
          });
        } else groups[groups.length - 1].days.push(day);
      });

    return groups.sort((a, b) => sortByDayOfWeek(a, b, calendarStartDayDate));
  }, [days]);

  return {
    calendarDate: {
      date: selectedDate,
      format: (pattern = calendarDateFormat, opts) => formatDate(selectedDate, pattern, opts),

      set: setSelectedDate,
      add: addToDate,
      subtract: (amt, unit) => addToDate(-amt, unit),
      addMonth: () => addToDate(1, 'months'),
      subtractMonth: () => addToDate(-1, 'months'),
      addYear: () => addToDate(1, 'years'),
      subtractYear: () => addToDate(-1, 'years'),
    },
    calendarStartDate: {
      date: new Date(),
      format: (pattern = 'dd-MM-yyyy', opts) => formatDate(selectedDate, pattern, opts),
    },
    calendarEndDate: {
      date: new Date(),
      format: (pattern = 'dd-MM-yyyy', opts) => formatDate(selectedDate, pattern, opts),
    },

    daysOfWeek: useMemo(() => {
      const firstWeek = new Date('1970-02-01');
      const daysOfWeek: CalendarDayOfWeek[] = [];

      Object.keys(DAYS_OF_WEEK).forEach((key) => {
        const day = DAYS_OF_WEEK[key as keyof typeof DAYS_OF_WEEK];
        const date = add(firstWeek, { days: day });
        daysOfWeek.push({
          day: day,
          date,
          format: (pattern = dayOfWeekFormat, opts) => formatDate(date, pattern, opts),
        });
      });

      return daysOfWeek.sort((a, b) => sortByDayOfWeek(a, b, calendarStartDayDate));
    }, [calendarStartDayDate, locale?.code, selectedDate]),

    days,
    groupedDays,

    isDisabled: !!disabled,
  };
};

export { useCalendar };
