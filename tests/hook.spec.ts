import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { UseCalendar, useCalendar } from '../src';
import { DayOfWeek } from '../src/types';

interface Day {
  day: number;
  dayOfMonth: number;
  month: 'current' | 'next' | 'prev';
}
const testMonth = (d: {
  startDay: DayOfWeek;
  first: Day;
  last: Day;
  totalDays: number;
  date: Date;
  order: number[];
  lengths: number[];
}) => {
  const { startDay, first, last, totalDays, date, order, lengths } = d;
  const { result, unmount } = renderHook(() => useCalendar({ defaultDate: date, calendarStartDay: startDay }));

  expect(result.current.days.length).toBe(totalDays);

  result.current.daysOfWeek.forEach(({ day }, i) => {
    expect(day).toBe(order[i]);
  });

  const firstDay = result.current.days[0];

  expect(firstDay.day).toBe(first.day);
  expect(firstDay.dayOfMonth).toBe(first.dayOfMonth);
  expect(firstDay.isCurrentMonth)[first.month === 'current' ? 'toBeTruthy' : 'toBeFalsy']();
  expect(firstDay.isNextMonth)[first.month === 'next' ? 'toBeTruthy' : 'toBeFalsy']();
  expect(firstDay.isPrevMonth)[first.month === 'prev' ? 'toBeTruthy' : 'toBeFalsy']();

  const lastDay = result.current.days[result.current.days.length - 1];
  expect(lastDay.day).toBe(last.day);
  expect(lastDay.dayOfMonth).toBe(last.dayOfMonth);
  expect(lastDay.isCurrentMonth)[last.month === 'current' ? 'toBeTruthy' : 'toBeFalsy']();
  expect(lastDay.isNextMonth)[last.month === 'next' ? 'toBeTruthy' : 'toBeFalsy']();
  expect(lastDay.isPrevMonth)[last.month === 'prev' ? 'toBeTruthy' : 'toBeFalsy']();

  expect(result.current.groupedDays.length).toBe(7);
  result.current.groupedDays.forEach((group, gi) => {
    expect(group.day).toBe(order[gi]);
    expect(group.days.length).toBe(lengths[gi]);

    group.days.forEach((d) => {
      expect(d.day).toBe(order[gi]);
    });
  });

  unmount();
};

describe('useCalendar hook', () => {
  beforeEach(() => {
    UseCalendar.resetOptions();
  });

  it('calendarDate', () => {
    const { result, unmount } = renderHook(() => useCalendar({}));

    const date = new Date('2022-07-01');
    act(() => result.current.calendarDate.set(date));
    expect(result.current.calendarDate.date).toEqual(date);

    act(() => result.current.calendarDate.addMonth());
    expect(result.current.calendarDate.date).toEqual(new Date('2022-08-01'));

    act(() => result.current.calendarDate.addYear());
    expect(result.current.calendarDate.date).toEqual(new Date('2023-08-01'));

    act(() => result.current.calendarDate.subtractMonth());
    expect(result.current.calendarDate.date).toEqual(new Date('2023-07-01'));

    act(() => result.current.calendarDate.subtractYear());
    expect(result.current.calendarDate.date).toEqual(new Date('2022-07-01'));

    act(() => result.current.calendarDate.add(2, 'days'));
    expect(result.current.calendarDate.date).toEqual(new Date('2022-07-03'));

    act(() => result.current.calendarDate.subtract(2, 'days'));
    expect(result.current.calendarDate.date).toEqual(new Date('2022-07-01'));

    act(() => result.current.calendarDate.add(1, 'weeks'));
    expect(result.current.calendarDate.date).toEqual(new Date('2022-07-08'));

    act(() => result.current.calendarDate.subtract(1, 'weeks'));
    expect(result.current.calendarDate.date).toEqual(new Date('2022-07-01'));

    expect(result.current.calendarDate.format()).toBe('07-2022');
    expect(result.current.calendarDate.format('dd-MM-yyyy')).toBe('01-07-2022');

    unmount();
  });

  it('days of week', () => {
    const test = (startDay: DayOfWeek, order: number[]) => {
      const { result, unmount } = renderHook(() => useCalendar({ calendarStartDay: startDay }));

      expect(result.current.daysOfWeek.length).toBe(7);
      result.current.daysOfWeek.forEach(({ day }, i) => {
        expect(day).toBe(order[i]);
      });

      unmount();
    };

    test('sunday', [0, 1, 2, 3, 4, 5, 6]);
    test('wednesday', [3, 4, 5, 6, 0, 1, 2]);
    test('friday', [5, 6, 0, 1, 2, 3, 4]);
    test('monday', [1, 2, 3, 4, 5, 6, 0]);
    test('saturday', [6, 0, 1, 2, 3, 4, 5]);
    test('thursday', [4, 5, 6, 0, 1, 2, 3]);
    test('tuesday', [2, 3, 4, 5, 6, 0, 1]);
  });

  it('January', () => {
    const date = new Date('2022-01-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 27, month: 'prev' },
      last: { day: 0, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 28, month: 'prev' },
      last: { day: 1, dayOfMonth: 31, month: 'current' },
      totalDays: 35,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 29, month: 'prev' },
      last: { day: 2, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 30, month: 'prev' },
      last: { day: 3, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 31, month: 'prev' },
      last: { day: 4, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 1, month: 'current' },
      last: { day: 5, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 26, month: 'prev' },
      last: { day: 6, dayOfMonth: 5, month: 'next' },
      totalDays: 42,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
  });

  it('February', () => {
    const date = new Date('2022-02-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 31, month: 'prev' },
      last: { day: 0, dayOfMonth: 6, month: 'next' },
      totalDays: 35,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 1, month: 'current' },
      last: { day: 1, dayOfMonth: 28, month: 'current' },
      totalDays: 28,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [4, 4, 4, 4, 4, 4, 4],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 26, month: 'prev' },
      last: { day: 2, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 27, month: 'prev' },
      last: { day: 3, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 28, month: 'prev' },
      last: { day: 4, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 29, month: 'prev' },
      last: { day: 5, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 30, month: 'prev' },
      last: { day: 6, dayOfMonth: 5, month: 'next' },
      totalDays: 35,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
  });

  it('March', () => {
    const date = new Date('2022-03-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 28, month: 'prev' },
      last: { day: 0, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 1, month: 'current' },
      last: { day: 1, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 23, month: 'prev' },
      last: { day: 2, dayOfMonth: 5, month: 'next' },
      totalDays: 42,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 24, month: 'prev' },
      last: { day: 3, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 25, month: 'prev' },
      last: { day: 4, dayOfMonth: 31, month: 'current' },
      totalDays: 35,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 26, month: 'prev' },
      last: { day: 5, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 27, month: 'prev' },
      last: { day: 6, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
  });

  it('April', () => {
    const date = new Date('2022-04-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 28, month: 'prev' },
      last: { day: 0, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 29, month: 'prev' },
      last: { day: 1, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 30, month: 'prev' },
      last: { day: 2, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 31, month: 'prev' },
      last: { day: 3, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 1, month: 'current' },
      last: { day: 4, dayOfMonth: 5, month: 'next' },
      totalDays: 35,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 26, month: 'prev' },
      last: { day: 5, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 27, month: 'prev' },
      last: { day: 6, dayOfMonth: 30, month: 'current' },
      totalDays: 35,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
  });

  it('May', () => {
    const date = new Date('2022-05-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 25, month: 'prev' },
      last: { day: 0, dayOfMonth: 5, month: 'next' },
      totalDays: 42,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 26, month: 'prev' },
      last: { day: 1, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 27, month: 'prev' },
      last: { day: 2, dayOfMonth: 31, month: 'current' },
      totalDays: 35,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 28, month: 'prev' },
      last: { day: 3, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 29, month: 'prev' },
      last: { day: 4, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 30, month: 'prev' },
      last: { day: 5, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 1, month: 'current' },
      last: { day: 6, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
  });

  it('June', () => {
    const date = new Date('2022-06-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 30, month: 'prev' },
      last: { day: 0, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 31, month: 'prev' },
      last: { day: 1, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 1, month: 'current' },
      last: { day: 2, dayOfMonth: 5, month: 'next' },
      totalDays: 35,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 26, month: 'prev' },
      last: { day: 3, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 27, month: 'prev' },
      last: { day: 4, dayOfMonth: 30, month: 'current' },
      totalDays: 35,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 28, month: 'prev' },
      last: { day: 5, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 29, month: 'prev' },
      last: { day: 6, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
  });

  it('July', () => {
    const date = new Date('2022-07-01');
    testMonth({
      startDay: 'monday',
      date,
      first: { day: 1, dayOfMonth: 27, month: 'prev' },
      last: { day: 0, dayOfMonth: 31, month: 'current' },
      totalDays: 35,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'tuesday',
      date,
      first: { day: 2, dayOfMonth: 28, month: 'prev' },
      last: { day: 1, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'wednesday',
      date,
      first: { day: 3, dayOfMonth: 29, month: 'prev' },
      last: { day: 2, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'thursday',
      date,
      first: { day: 4, dayOfMonth: 30, month: 'prev' },
      last: { day: 3, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'friday',
      date,
      first: { day: 5, dayOfMonth: 1, month: 'current' },
      last: { day: 4, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'saturday',
      date,
      first: { day: 6, dayOfMonth: 25, month: 'prev' },
      last: { day: 5, dayOfMonth: 5, month: 'next' },
      totalDays: 42,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'sunday',
      date,
      first: { day: 0, dayOfMonth: 26, month: 'prev' },
      last: { day: 6, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
  });

  it('August', () => {
    const date = new Date('2022-08-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 1, month: 'current' },
      last: { day: 0, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 26, month: 'prev' },
      last: { day: 1, dayOfMonth: 5, month: 'next' },
      totalDays: 42,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 27, month: 'prev' },
      last: { day: 2, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 28, month: 'prev' },
      last: { day: 3, dayOfMonth: 31, month: 'current' },
      totalDays: 35,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 29, month: 'prev' },
      last: { day: 4, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 30, month: 'prev' },
      last: { day: 5, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 31, month: 'prev' },
      last: { day: 6, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
  });

  it('September', () => {
    const date = new Date('2022-09-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 29, month: 'prev' },
      last: { day: 0, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 30, month: 'prev' },
      last: { day: 1, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 31, month: 'prev' },
      last: { day: 2, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 1, month: 'current' },
      last: { day: 3, dayOfMonth: 5, month: 'next' },
      totalDays: 35,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 26, month: 'prev' },
      last: { day: 4, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 27, month: 'prev' },
      last: { day: 5, dayOfMonth: 30, month: 'current' },
      totalDays: 35,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 28, month: 'prev' },
      last: { day: 6, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
  });

  it('October', () => {
    const date = new Date('2022-10-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 26, month: 'prev' },
      last: { day: 0, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 27, month: 'prev' },
      last: { day: 1, dayOfMonth: 31, month: 'current' },
      totalDays: 35,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 28, month: 'prev' },
      last: { day: 2, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 29, month: 'prev' },
      last: { day: 3, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 30, month: 'prev' },
      last: { day: 4, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 1, month: 'current' },
      last: { day: 5, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 25, month: 'prev' },
      last: { day: 6, dayOfMonth: 5, month: 'next' },
      totalDays: 42,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
  });

  it('November', () => {
    const date = new Date('2022-11-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 31, month: 'prev' },
      last: { day: 0, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 1, month: 'current' },
      last: { day: 1, dayOfMonth: 5, month: 'next' },
      totalDays: 35,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 26, month: 'prev' },
      last: { day: 2, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 27, month: 'prev' },
      last: { day: 3, dayOfMonth: 30, month: 'current' },
      totalDays: 35,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 28, month: 'prev' },
      last: { day: 4, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 29, month: 'prev' },
      last: { day: 5, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 30, month: 'prev' },
      last: { day: 6, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
  });

  it('December', () => {
    const date = new Date('2022-12-01');
    testMonth({
      startDay: 'monday',
      date: date,
      first: { day: 1, dayOfMonth: 28, month: 'prev' },
      last: { day: 0, dayOfMonth: 1, month: 'next' },
      totalDays: 35,
      order: [1, 2, 3, 4, 5, 6, 0],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'tuesday',
      date: date,
      first: { day: 2, dayOfMonth: 29, month: 'prev' },
      last: { day: 1, dayOfMonth: 2, month: 'next' },
      totalDays: 35,
      order: [2, 3, 4, 5, 6, 0, 1],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'wednesday',
      date: date,
      first: { day: 3, dayOfMonth: 30, month: 'prev' },
      last: { day: 2, dayOfMonth: 3, month: 'next' },
      totalDays: 35,
      order: [3, 4, 5, 6, 0, 1, 2],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'thursday',
      date: date,
      first: { day: 4, dayOfMonth: 1, month: 'current' },
      last: { day: 3, dayOfMonth: 4, month: 'next' },
      totalDays: 35,
      order: [4, 5, 6, 0, 1, 2, 3],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
    testMonth({
      startDay: 'friday',
      date: date,
      first: { day: 5, dayOfMonth: 25, month: 'prev' },
      last: { day: 4, dayOfMonth: 5, month: 'next' },
      totalDays: 42,
      order: [5, 6, 0, 1, 2, 3, 4],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'saturday',
      date: date,
      first: { day: 6, dayOfMonth: 26, month: 'prev' },
      last: { day: 5, dayOfMonth: 6, month: 'next' },
      totalDays: 42,
      order: [6, 0, 1, 2, 3, 4, 5],
      lengths: [6, 6, 6, 6, 6, 6, 6],
    });
    testMonth({
      startDay: 'sunday',
      date: date,
      first: { day: 0, dayOfMonth: 27, month: 'prev' },
      last: { day: 6, dayOfMonth: 31, month: 'current' },
      totalDays: 35,
      order: [0, 1, 2, 3, 4, 5, 6],
      lengths: [5, 5, 5, 5, 5, 5, 5],
    });
  });
});
