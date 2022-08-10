import './index.css';
import { createRoot } from 'react-dom/client';
import { UseCalendar, useCalendar } from '../../src';
import clsx from 'clsx';
import { useState } from 'react';
import { DayOfWeek } from '../../src/types';

UseCalendar.setCalendarStartDay('monday');

const App = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [disabled, setDisabled] = useState(false);
  const [disabledWeekends, setDisabledWeekends] = useState(true);
  const [disabledWeekDays, setDisabledWeekDays] = useState(false);
  const [calendarStartDay, setCalendarStartDay] = useState<DayOfWeek>('monday');
  const [alwaysSixRows, setAlwaysSixRows] = useState(false);

  const { calendarDate, groupedDays, daysOfWeek } = useCalendar({
    disabled,
    calendarStartDay,
    disableWeekends: disabledWeekends,
    disableWeekDays: disabledWeekDays,
    alwaysSixRows,
  });

  console.log(daysOfWeek)

  return (
    <main className="p-4 grid gap-4">
      <section className="grid grid-flow-col gap-2 justify-center">
        <select
          className="border-2 border-blue-500 rounded-sm py-2 px-3"
          value={calendarStartDay}
          onChange={(e) => setCalendarStartDay(e.target.value as DayOfWeek)}
        >
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
          <option value="sunday">Sunday</option>
        </select>

        <button className={disabled ? 'button-danger' : 'button'} onClick={() => setDisabled((p) => !p)}>
          {disabled ? 'Enable' : 'Disable'}
        </button>
        <button className={disabledWeekends ? 'button-danger' : 'button'} onClick={() => setDisabledWeekends((p) => !p)}>
          {disabledWeekends ? 'Enable weekends' : 'Disable weekends'}
        </button>
        <button className={disabledWeekDays ? 'button-danger' : 'button'} onClick={() => setDisabledWeekDays((p) => !p)}>
          {disabledWeekDays ? 'Enable week days' : 'Disable week days'}
        </button>
        <button className="button" onClick={() => setAlwaysSixRows((p) => !p)}>
          {!alwaysSixRows ? 'Always six rows' : 'Auto rows'}
        </button>
      </section>

      <section>
        <div className="grid grid-flow-col gap-x-1 justify-center items-center">
          <button className="button" onClick={calendarDate.subtractYear}>
            {'<<'}
          </button>
          <button className="button" onClick={calendarDate.subtractMonth}>
            {'<'}
          </button>
          <span>{calendarDate.format()}</span>
          <button className="button" onClick={calendarDate.addMonth}>
            {'>'}
          </button>
          <button className="button" onClick={calendarDate.addYear}>
            {'>>'}
          </button>
        </div>
        <ol className="list-none grid grid-flow-col justify-center mt-2">
          {groupedDays.map((group) => (
            <li key={group.key} className="w-10 h-8 grid place-items-center">
              <span className="font-bold">{group.format()}</span>
              <ol className="list-none grid">
                {group.days.map((day) => (
                  <li key={day.key} className={clsx('w-8 h-8')}>
                    <button
                      className={clsx(
                        'w-full h-full rounded-full  grid place-items-center disabled:text-gray-300 disabled:hover:bg-transparent',
                        selectedDate.getTime() == day.date.getTime() ? 'bg-green-300' : 'hover:bg-green-100',
                        !day.isCurrentMonth ? 'text-gray-500' : 'text-black'
                      )}
                      disabled={day.isDisabled}
                      onClick={() => {
                        if (!day.isCurrentMonth) calendarDate.set(day.date);
                        setSelectedDate(day.date);
                      }}
                    >
                      {day.format()}
                    </button>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
