import React from 'react';
import './ScheduleTable.css';

interface ScheduleTableProps {
  departureTimesByHour: any;
}

class ScheduleTable extends React.Component<ScheduleTableProps> {

  renderDepartureTime(departureTime: string) {
    return (
      <span key={`departure-${departureTime}`} className="departure-time-schedule">
        {departureTime}
      </span>
    );
  }

  renderHour(hour: string) {
    return (
      <tr key={`schedule-hour-${hour}`} className="departure-time-row">
        <td className="hour">
          {hour}
        </td>
        <td className="departure-time-schedule-column">
          {this.props.departureTimesByHour[hour].map((departureTime: string) => {
            return this.renderDepartureTime(departureTime);
          })}
        </td>
      </tr>
    );
  }

  renderTable() {
    return (
      <table className="schedule-table">
        <tbody>
          {Object.keys(this.props.departureTimesByHour).map((hour) => {
            return this.renderHour(hour);
          })}
        </tbody>
      </table>
    );
  }

  render() {
    if (!this.props.departureTimesByHour || Object.keys(this.props.departureTimesByHour).length === 0) return (
      <div className="schedule-table-wrapper">
        no departures found for this date on the selected trip's itinerary
      </div>
    );
    return (
      <div className="schedule-table-wrapper">
        showing all departures for selected trip's itinerary on selected date:
        {this.renderTable()}
      </div>
    );
  }
}

export default ScheduleTable;