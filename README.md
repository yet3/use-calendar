# useCalendar

![GitHub license](https://img.shields.io/github/license/yet3/use-calendar?style=flat)

React hook that makes creating calendars easier.

### Table of Contents

- [Installation](#installation)
- [Usage](#quick-usage)
  - [Quick](#quick-usage)
  - [Full example](#full-example)
  - [Controlled calendar date example](#controlled-calendar-date-example)
- [.format()](#format)
- [useCalendar](#usecalendar-1)
- [UseCalendar](#usecalendar-2)
  - [Setting locale](#usecalendar-2)
- [Options](#options)
- [CalendarDay](#calendarday)
- [CalendarGroup](#calendargroup)
- [Other types](#other-types)
- [Depends on](#depends-on)

### Installation

```sh
yarn add @yet3/use-calendar
```

or with npm

```sh
npm install @yet3/use-calendar
```

### Quick usage

```tsx
import { useCalendar, UseCalendar } from '@yet3/use-calendar';

const MyCalendar = () => {
  const { calendarDate, days, daysOfWeek } = useCalendar()

  ...
}
```

### .format()

Each `.format(pattern, options)` method accepts pattern and options, both of those arguments are optional as each format method has a default pattern.

See date-fns's [format docs](https://date-fns.org/v2.29.1/docs/format) for possible patterns.

### useCalendar

useCalendar hook returns:

- calendarDate:
  - date: Date - calendar's date
  - format: [FormatFunc](#types) - format function (default pattern: 'MM-yyyy')
  - set: Dispatch<SetStateAction<Date>> - setter function
  - add: (amt: number, unit: [Unit](#types)) => void - add x of specified unit to calendar's date
  - subtract: (amt: number, unit: [Unit](#types)) => void - subtract x of specified unit from calendar's date
  - addMonth: () => void - add 1 month to calendar's date
  - subtractMonth: () => void - subtract 1 month to calendar's date
  - addYear: () => void - add 1 year to calendar's date
  - subtractYear: () => void - subtract 1 year to calendar's date
- calendarStartDate:
  - date: Date - first day of calendar's date month
  - format: [FormatFunc](#types) - format function (default pattern: 'MM-yyyy')
- calendarEndDate:
  - date: Date - last day of calendar's date month
  - format: [FormatFunc](#types) - format function (default pattern: 'MM-yyyy')
- daysOfWeek: CalendarDayOfWeek[] - array of each day of week (sorted based on [calendarStartDay](#options))
- days: CalendarDay[] - days in calendar's date month
- groupedDays: CalendarGroup[] - days in calendar's date month grouped by each day of week
- isDisabled: boolean - whether entire calendar is disabled

### UseCalendar

UseCalendar is used to set options globally.

Properties:

- DEFAULT_OPTIONS: [Options](#options) - calendar's default options
- options: [Options](#options) - calendar's options
- setOptions(options: Partial<[Options](#options)>): void - calendar's options setter
- setLocale: (locale: Locale) => void - function to set calendar's locale (it can also be set through setOptions)
- setCalendarStartDay(day: DayOfWeek): void - function to set day at which calendar will start (it can also be set through setOptions)
- resetOptions(): void - function to reset options

Example:

```ts
import { UseCalendar } from '@yet3/use-calendar';
import fr from 'date-fns/locale/fr';

UseCalendar.setOptions({ alwaysSixRows: true });
UseCalendar.setCalendarStartDay('tuesday');
UseCalendar.setLocale(fr);
```

### Options

Options can be set by passing them to `useCalendar(Options)` hook or by setting them using `UseCalendar.setOptions(Options)`

- defaultDate?: Date | null | false - date with which calendar will be initialized
- calendarStartDay?: [DayOfWeek](#types) - day at which calendar will start
- disabled?: boolean - whether calendar is disabled
- disableWeekDays?: boolean - whether week days are disabled
- disableWeekends?: boolean - whether weekends are disabled
- alwaysSixRows?: boolean - whether useCalendar's days/groupedDays should always return 42 days (6 rows \* 7 days)
- locale?: Locale - calendars locale
- dayOfWeekFormat?: string - format pattern of each day of the week (monday...sunday);
- dayFormat?: string - format pattern of each of the days in calendar
- calendarDateFormat?: string - format pattern of calendars date

### CalendarDay

- day: number - day of week (0...6)
- isoDay: number - iso day of week (1...7)
- dayOfMonth: number - day of month
- date: Date - day's date
- format: [FormatFunc](#types) - format function (default pattern: 'dd')
- isWeekDay?: boolean - whether day is a week day (every day except weekends)
- isWeekend?: boolean - whether day is a weekend
- isCurrentMonth?: boolean - whether day is in current calendar's month
- isPrevMonth?: boolean - whether day is in previous calendar's month
- isNextMonth?: boolean - whether day is in next calendar's month
- isDisabled?: boolean - whether day is disabled
- key: string - unique key

### CalendarGroup:

- day: number - day of week (0...6)
- isoDay: number - iso day of week (1...7)
- format: [FormatFunc](#types) - format function (default pattern: 'EEEEEE')
- week: number - week of month
- isoWeek: number - iso week of month
- days: [CalendarDay](#types)[];
- key: string - unique key

### Other types

- Unit: 'days' | 'months' | 'years' | 'weeks'
- FormatFunc: (pattern?: string, options?: FormatOptions) => string
- DayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
- CalendarDayOfWeek:
  - day: number - from 0 to 6 (0 being sunday and 6 being saturday)
  - date: Date
  - format: [FormatFunc](#types)


### Full example
```tsx
import { useCalendar, UseCalendar } from '@yet3/use-calendar';

UseCalendar.setOptions({ alwaysSixRows: true });

const MyCalendar = () => {
  const { calendarDate, days, daysOfWeek } = useCalendar({ disableWeekends: true });

  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: '0.5rem' }}>
      <div
        style={{
          display: 'grid',
          placeContent: 'center',
          gridTemplateColumns: '1fr 1fr 4rem 1fr 1fr',
          gap: '0.25rem',
          justifyItems: 'center',
        }}
      >
        <button onClick={calendarDate.subtractYear}>{'<<'}</button>
        <button onClick={calendarDate.subtractMonth}>{'<'}</button>
        <span>{calendarDate.format()}</span>
        <button onClick={calendarDate.addMonth}>{'>'}</button>
        <button onClick={calendarDate.addYear}>{'>>'}</button>
      </div>
      <ol
        style={{
          listStyleType: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 2rem)',
          gap: '0.1rem',
          gridColumn: '1/-1',
        }}
      >
        {daysOfWeek.map((day) => (
          <li
            key={day.day}
            style={{
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              width: '100%',
              fontWeight: 'bold',
            }}
          >
            {day.format()}
          </li>
        ))}
        {days.map((day) => (
          <li
            key={day.key}
            onClick={() => {
              if (!day.isCurrentMonth && !day.isDisabled) calendarDate.set(day.date);
            }}
            style={{
              color: day.isDisabled ? 'rgb(190, 190, 190)' : day.isCurrentMonth ? 'black' : 'rgb(120, 120, 120)',
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              width: '100%',
              aspectRatio: '1/1',
              cursor: 'pointer',
            }}
          >
            {day.format()}
          </li>
        ))}
      </ol>
    </div>
  );
};
```

### Controlled calendar date example
```tsx
import { SetStateActions, useState } from 'react';
import { useCalendar, UseCalendar } from '@yet3/use-calendar';

const MyComponent = () => {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <div>
      <h1>My super cool calendar</h1>
      <MyCalendar />
    </div>
  )
}

interface CalendarProps {
  date: Date
  setDate: (value: SetSateAction<Date>) => void
}

const MyCalendar = ({ date, setDate }: CalendarProps) => {
  const { calendarDate, days, daysOfWeek } = useCalendar({
    calendarDate: date,
    setCalendarDate: setDate
  });

  ...
}
```

### Depends on

This package makes use of [date-fns](https://date-fns.org/docs/Getting-Started) library.
