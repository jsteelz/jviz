import React from 'react';
import './ShadedCalendar.css';

enum Weekday {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

enum Month {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

interface CalendarProps {
  year: number,
  month: Month,
  shadedDays: Set<number>,
}

class ShadedCalendar extends React.Component<CalendarProps> {
  renderDay(day: number, daysInMonth: number) {
    // todo: add trip id to the td key
    if (day < 1 || day > daysInMonth) {
      return (
        <td key={`day-${String(day)}`} className="inactive-date">&nbsp;</td>
      );
    }
    if (this.props.shadedDays.has(day)) {
      return (
        <td key={`day-${String(day)}`} className="shaded-date">{day}</td>
      );
    }
    return (
      <td key={`day-${String(day)}`} className="not-shaded-date">{day}</td>
    );
  }

  renderRow(startDay: number, daysInMonth: number) {
    const daysToRender = [];
    for (let i = startDay; i < startDay + 7; i++) daysToRender.push(i);
    return (
      // todo: add trip id to the row key
      <tr key={`row-${startDay}`}>
        {daysToRender.map((day: number) => this.renderDay(day, daysInMonth))}
      </tr>
    );
  }

  renderRows() {
    const daysInMonth = new Date(this.props.year, this.props.month, 0).getDate();
    const weekdayOfFirstDay = new Date(this.props.year, this.props.month - 1, 1).getDay();
    const startDay = weekdayOfFirstDay < 1 ? -5 : 1 - (weekdayOfFirstDay - 1);
    let rowsToRender = [];
    for (let i = startDay; i < daysInMonth; i += 7) rowsToRender.push(i);
  
    return rowsToRender.map((day) => this.renderRow(day, daysInMonth));
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th key="monday">M</th>
            <th key="tuesday">T</th>
            <th key="wednesday">W</th>
            <th key="thursday">T</th>
            <th key="friday">F</th>
            <th key="saturday">S</th>
            <th key="sunday">S</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRows()}
        </tbody> 
      </table>
    );
  }
}

export default ShadedCalendar;
