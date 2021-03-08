import React from 'react';
import FileInfo from '../FileInfo/FileInfo';
import ShadedCalendar from '../ShadedCalendar/ShadedCalendar';
import CollapsibleElement from '../CollapsibleElement/CollapsibleElement';
import ScheduleTable from '../ScheduleTable/ScheduleTable';
import './RightMenu.css';
import getJsonData from '../common/getJsonData';
import { Route } from '../common/GtfsTypes';

interface RightMenuProps {
  route: Route | undefined;
  tripJkey: string;
  date: string;
  routes: Route[];
}

interface RightMenuState {
  shadedDays: Set<number> | undefined;
  itinerarySchedule: any;
  route: Route | undefined;
}

class RightMenu extends React.Component<RightMenuProps, RightMenuState> {
  constructor(props: any) {
    super(props);

    this.state = {
      shadedDays: undefined,
      itinerarySchedule: undefined,
      route: undefined,
    };
  }

  async componentDidMount() {
    if (this.props.tripJkey) {
      let route = undefined;
      let shadedDays = undefined;
      let itinerarySchedule = undefined;
      const tripInfo = await getJsonData(`.visualizefiles/trips/${this.props.tripJkey}.json`);

      // if trip is defined but route isn't, get route jkey and show route info
      if (!this.props.route) {
        route = this.props.routes.find((route) => route.route_jkey === tripInfo['route_jkey']);
      } else {
        route = this.props.route;
      }

      if (this.props.date) {
        shadedDays = await this.getShadedDays(tripInfo['service_jkey']);
        if (route) {
          itinerarySchedule = await this.getItinerarySchedule(route.route_jkey, tripInfo['service_jkey']);
        }
      }

      this.setState({
        route: route,
        shadedDays: shadedDays,
        itinerarySchedule: itinerarySchedule,
      });
    }
  }

  async getShadedDays(serviceJkey: string) {
    const shadedDays = new Set<number>();
    const daysInMonth = new Date(
      parseInt(this.props.date.substring(0, 4)),
      parseInt(this.props.date.substring(4, 6)),
      0
    ).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const dateToSearch = `${this.props.date.substring(0, 6)}${i < 10 ? `0${String(i)}` : String(i)}`;
      const serviceJkeys = await getJsonData(`.visualizefiles/service_jkeys_by_date/${dateToSearch}.json`);

      if (!serviceJkeys) continue;

      if (serviceJkeys.includes(serviceJkey)) {
        shadedDays.add(parseInt(dateToSearch.substring(6, 8)));
      }
    }

    return shadedDays;
  }

  async getItinerarySchedule(routeJkey: string, serviceJkey: string) {
    const departureTimes: { [index:string] : any } = {};

    const searchKey = `${routeJkey}_${serviceJkey}`;
    const tripInfo = await getJsonData(`.visualizefiles/trips/${this.props.tripJkey}.json`);

    if (!tripInfo) return undefined;
    const itineraryId = tripInfo['itinerary_id'];

    const tripsByHour = await getJsonData(`.visualizefiles/trips_by_route_by_hour/${searchKey}.json`);

    if (!tripsByHour || Object.keys(tripsByHour).length === 0) return undefined;

    for (const hour of Object.keys(tripsByHour)) {
      departureTimes[hour] = [];
      const trips = tripsByHour[hour];
      for (const tripToCompare of trips) {
        const tripToCompareInfo = await getJsonData(`.visualizefiles/trips/${tripToCompare}.json`);
        if (!tripToCompareInfo) continue;

        if (tripToCompareInfo['itinerary_id'] === itineraryId) {
          departureTimes[hour].push(tripToCompareInfo['departure_time'].substr(3));
        }
      }
    }

    return departureTimes;
  }

  renderRouteInfo() {
    const route = this.props.route || this.state.route;
    if (!route) return null;
    return (
      <CollapsibleElement
        title="routes.txt"
        key={route.route_jkey}
        content={
          <FileInfo
            requestUrl={`.visualizefiles/routes/${route.route_jkey}.json`}
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
    if (this.state.shadedDays === undefined) return null;
    return (
      <CollapsibleElement
        title="dates active"
        content={
          <div>
            {`days on which ${this.props.tripJkey ? 'selected trip' : 'selected route'} operates:`}
            <div className="month-header">
              {`${this.getMonth(parseInt(this.props.date.substring(4, 6)))} 2021`}
            </div>
            <ShadedCalendar
              year={parseInt(this.props.date.substring(0, 4))}
              month={parseInt(this.props.date.substring(4, 6))}
              shadedDays={this.state.shadedDays}
            />
          </div>
        }
      />
    )
  }

  renderItinerarySchedule() {
    if (!this.props.tripJkey || !this.props.date) return null;
    return (
      <CollapsibleElement
        title="itinerary schedule"
        key={`table-${this.props.tripJkey}-${this.props.date}`}
        content={
          <ScheduleTable
            departureTimesByHour={this.state.itinerarySchedule}
          />
        }
      />
    );
  }
  
  render() {
    if (!this.props.route && !this.props.tripJkey) return null;
    return (
    <div className="rightmenu">
      {this.renderRouteInfo()}
      {this.renderTripInfo()}
      {this.renderShadedCalendar()}
      {this.renderItinerarySchedule()}
    </div>
    );
  }
}

export default RightMenu;
