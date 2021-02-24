import React from 'react';
import FileInfo from '../FileInfo/FileInfo';
import ShadedCalendar from '../ShadedCalendar/ShadedCalendar';
import CollapsibleElement from '../CollapsibleElement/CollapsibleElement';
import './RightMenu.css';
import { Route } from '../common/GtfsTypes';

interface RightMenuProps {
  route: Route | undefined;
  tripJkey: string;
  date: string;
}

class RightMenu extends React.Component<RightMenuProps> {
  async componentDidMount() {
    // todo: if trip is defined but route isn't, get route jkey and show route info
  }

  renderRouteInfo() {
    if (!this.props.route) return null;
    return (
      <CollapsibleElement
        title="routes.txt"
        key={this.props.route.route_jkey}
        content={
          <FileInfo
            requestUrl={`.visualizefiles/routes/${this.props.route.route_jkey}.json`}
            fieldsToExclude={['route_jkey', 'sample_trip_jkeys']}
          />
        }
      />
    );
  }

  renderTripInfo() {
    if (!this.props.tripJkey) return null;
    return (
      <CollapsibleElement
        title="trips.txt"
        key={this.props.tripJkey}
        content={
          <FileInfo
            requestUrl={`.visualizefiles/trips/${this.props.tripJkey}.json`}
            fieldsToExclude={
              ['trip_jkey', 'timing_list', 'itinerary_id', 'service_jkey', 'route_jkey', 'departure_time']
            }
          />
        }
      />
    );
  }

  getMonth(month: number) {
    if (month === 1) return 'January';
    if (month === 2) return 'February';
    if (month === 3) return 'March';
    if (month === 4) return 'April';
    if (month === 5) return 'May';
    if (month === 6) return 'June';
    if (month === 7) return 'July';
    if (month === 8) return 'August';
    if (month === 9) return 'September';
    if (month === 10) return 'October';
    if (month === 11) return 'November';
    if (month === 12) return 'December';
    return '';
  }

  renderShadedCalendar() {
    // if (!this.props.date) return null;
    // const year = parseInt(this.props.date.substring(0, 4));
    // const month = parseInt(this.props.date.substring(4, 6));
    return (
      <CollapsibleElement
        title="dates active"
        content={
          <div>
            {`days on which ${this.props.tripJkey ? 'selected trip' : 'selected route'} operates:`}
            <div className="month-header">
              {`${this.getMonth(/*month*/ 4)} 2021`}
            </div>
            <ShadedCalendar
              year={/*year*/ 2021}
              month={/*month*/ 4}
              shadedDays={new Set([2, 15, 16, 23])}
            />
          </div>
        }
      />
    )
  }
  
  render() {
    if (!this.props.route && !this.props.tripJkey) return null;
    return (
    <div className="rightmenu">
      {this.renderRouteInfo()}
      {this.renderTripInfo()}
      {this.renderShadedCalendar()}
    </div>
    );
  }
}

export default RightMenu;
