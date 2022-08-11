import fr from 'date-fns/locale/fr';
import { UseCalendar } from '../src';

describe('UseCalendar', () => {
  beforeEach(() => {
    UseCalendar.resetOptions();
  });

  it('setting options', () => {
    expect(UseCalendar.options).toEqual(UseCalendar.DEFAULT_OPTIONS);

    UseCalendar.setLocale(fr);
    expect(UseCalendar.options.locale).toEqual(fr);

    UseCalendar.setCalendarStartDay('thursday');
    expect(UseCalendar.options.calendarStartDay).toEqual('thursday');

    const now = new Date();
    UseCalendar.setOptions({ defaultDate: now, disableWeekDays: true, dayOfWeekFormat: 'EEEE' });
    expect(UseCalendar.options.defaultDate).toEqual(now)
    expect(UseCalendar.options.disableWeekDays).toBe(true)
    expect(UseCalendar.options.dayOfWeekFormat).toBe('EEEE')
  });
});
