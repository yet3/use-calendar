import pl from 'date-fns/locale/pl';
import { DayOfWeek, UseCalendar } from '../src';
import { DAYS_OF_WEEK } from '../src/utils/daysOfWeek.const';
import { mergeOptions } from '../src/utils/mergeOptions.util';
import { sortByDayOfWeek } from '../src/utils/sortByDayOfWeek.util';

describe('Utils', () => {
  beforeEach(() => {
    UseCalendar.resetOptions();
  });

  it('days of week const', () => {
    expect(DAYS_OF_WEEK.sunday).toBe(0);
    expect(DAYS_OF_WEEK.monday).toBe(1);
    expect(DAYS_OF_WEEK.tuesday).toBe(2);
    expect(DAYS_OF_WEEK.wednesday).toBe(3);
    expect(DAYS_OF_WEEK.thursday).toBe(4);
    expect(DAYS_OF_WEEK.friday).toBe(5);
    expect(DAYS_OF_WEEK.saturday).toBe(6);
  });

  it('sort by day of week', () => {
    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6].map((v) => ({ day: v }));

    const sortDays = (startDay: number) => {
      return expect(daysOfWeek.sort((a, b) => sortByDayOfWeek(a, b, startDay)).map((a) => a.day));
    };

    sortDays(3).toEqual([3, 4, 5, 6, 0, 1, 2]);
    sortDays(5).toEqual([5, 6, 0, 1, 2, 3, 4]);
    sortDays(2).toEqual([2, 3, 4, 5, 6, 0, 1]);
    sortDays(1).toEqual([1, 2, 3, 4, 5, 6, 0]);
    sortDays(6).toEqual([6, 0, 1, 2, 3, 4, 5]);
    sortDays(4).toEqual([4, 5, 6, 0, 1, 2, 3]);
    sortDays(0).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('option merging', () => {
    let opts = mergeOptions({});
    expect(opts).toBeDefined();
    expect(opts.calendarStartDay).toBeDefined();
    expect(opts.dayFormat).toBeDefined();
    expect(opts.dayOfWeekFormat).toBeDefined();
    expect(opts.calendarDateFormat).toBeDefined();

    UseCalendar.setCalendarStartDay('tuesday');
    UseCalendar.setOptions({ dayFormat: 'ddd', calendarDateFormat: 'dd-MM-yyyy' });
    UseCalendar.setLocale(pl);

    opts = mergeOptions({ dayFormat: 'dd' });

    expect(opts).toBeDefined();
    expect(opts.locale).toEqual(pl);
    expect(opts.calendarStartDay).toBe('tuesday');
    expect(opts.dayFormat).toBe('dd');
    expect(opts.calendarDateFormat).toBe('dd-MM-yyyy');
  });
});
