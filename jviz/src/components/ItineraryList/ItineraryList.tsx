import React from 'react';
import { observer } from 'mobx-react';
import './ItineraryList.css';
import getJsonData from '../common/getJsonData';
import { storeContext } from '../../store';

@observer
class ItineraryList extends React.Component {
  static contextType = storeContext;

  getMonth(month: string) {
    if (month === '01') return 'January';
    if (month === '02') return 'February';
    if (month === '03') return 'March';
    if (month === '04') return 'April';
    if (month === '05') return 'May';
    if (month === '06') return 'June';
    if (month === '07') return 'July';
    if (month === '08') return 'August';
    if (month === '09') return 'September';
    if (month === '10') return 'October';
    if (month === '11') return 'November';
    if (month === '12') return 'December';
    return '';
  }

  prettyPrintDate(date: string) {
    const day = date.substring(6, 8).replace(/^0/, '');
    const month = this.getMonth(date.substring(4, 6));
    const year = date.substring(0, 4);

    return `${month} ${day}, ${year}`;
  }

  renderDateAndTime() {
    let toReturn = '';
    if (this.context.store.date) {
      toReturn += ` on ${this.prettyPrintDate(this.context.store.date)}`;
    }
    if (this.context.store.time) {
      toReturn += ` at ${this.context.store.time}`;
    }
    return toReturn;
  }

  render () {
    if (!this.context.store.route) return null;
    return (
      <div className="itinerarylistparent">
        <div className="itinerarylisttitle">
          Showing all itineraries for route
          <span className="route-itinerary"> {
            this.context.store.route.route_short_name ? this.context.store.route.route_short_name
              : this.context.store.route.route_long_name
          }</span>
          {this.renderDateAndTime()}:
        </div>
      </div>
    );
  }
}

export default ItineraryList;