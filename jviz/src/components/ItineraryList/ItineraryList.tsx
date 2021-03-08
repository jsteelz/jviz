import React from 'react';
import './ItineraryList.css';
import {
  loadAllRouteItins,
  loadAllRouteItinsForDate,
  loadAllRouteItinsAtTime,
} from './ItineraryListHelpers';
import getJsonData from '../common/getJsonData';
import { Route } from '../common/GtfsTypes';

interface ItineraryListProps {
  route: Route;
  date: string;
  time: string;
  onTripClicked(trip: string): void;
}

interface ItineraryListState {
  tripsByItineraryId: any;
  itineraryInfoByItineraryId: any;
  activeTripJkey: string;
  hasLoadedItineraries: boolean;
}

class ItineraryList extends React.Component<ItineraryListProps, ItineraryListState> {
  constructor(props: any) {
    super(props);

    this.state = {
      tripsByItineraryId: undefined,
      itineraryInfoByItineraryId: undefined,
      activeTripJkey: '',
      hasLoadedItineraries: false,
    };
  }

  async componentDidMount() {
    let tripsByItineraryId: any;
    if (!this.props.date) {
      tripsByItineraryId = await loadAllRouteItins(this.props.route.route_jkey);
    } else if (!this.props.time) {
      tripsByItineraryId = await loadAllRouteItinsForDate(this.props.route.route_jkey, this.props.date);
    } else {
      tripsByItineraryId = await loadAllRouteItinsAtTime(this.props.route.route_jkey, this.props.date, this.props.time);
    }

    Object.keys(tripsByItineraryId).forEach((itineraryId) => {
      tripsByItineraryId[itineraryId].sort((a: any, b: any) => a['departure_time'].localeCompare(b['departure_time']));
    });

    const itineraryInfo: any = {};
    for (const itineraryId of Object.keys(tripsByItineraryId)) {
      const filePath = `.visualizefiles/itineraries/${this.props.route.route_jkey}/itin_${itineraryId}.json`;
      itineraryInfo[itineraryId] = await getJsonData(filePath);
    }

    this.setState({
      itineraryInfoByItineraryId: itineraryInfo,
      tripsByItineraryId: tripsByItineraryId,
      hasLoadedItineraries: true,
    });
  }

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

  onClickTrip(tripJkey: string) {
    this.setState({
      activeTripJkey: tripJkey
    });

    this.props.onTripClicked(tripJkey);
  }

  renderDateAndTime() {
    let toReturn = '';
    if (this.props.date) {
      toReturn += ` on ${this.prettyPrintDate(this.props.date)}`;
    }
    if (this.props.time) {
      toReturn += ` at ${this.props.time}`;
    }
    return toReturn;
  }

  renderHeader() {
    return (
      <div className="itinerarylisttitle">
        Showing all itineraries for route
        <span className="route-itinerary"> {
          this.props.route.route_short_name ? this.props.route.route_short_name
            : this.props.route.route_long_name
        }</span>
        {this.renderDateAndTime()}:
      </div>
    );
  }

  renderNumberOfItineraries(itineraryId: string) {
    const numberOfItineraries = this.state.tripsByItineraryId[itineraryId].length;
    const numberString = `${String(numberOfItineraries)} ${numberOfItineraries === 1 ? 'trip' : 'trips'}`

    if (this.props.time) {
      return (
        <div className="number-of-trips-in-itinerary">
          {`${numberString} starting within selected hour`}
        </div>
      );
    } else if (this.props.date) {
      return (
        <div className="number-of-trips-in-itinerary">
          {`${numberString} on selected date`}
        </div>
      );
    } else {
      return null;
    }
  }

  renderItinerary(itineraryId: string) {
    return (
      <div
        className="itinerary-trips"
        key={`${itineraryId}-${this.props.route.route_jkey}-${this.props.date}-${this.props.time}`}
      >
        <div className="itinerary-name">
          {`${this.state.itineraryInfoByItineraryId[itineraryId]['itinerary_name']}:`}
        </div>
        {this.renderNumberOfItineraries(itineraryId)}
        <div className="trips-list">
          {this.state.tripsByItineraryId[itineraryId].slice(0, 3).map((trip: any) => {
            return (
              <span
                key={trip['trip_jkey']}
                className={this.state.activeTripJkey === trip['trip_jkey'] ? 'departure-time-selected' : 'departure-time'}
                onClick={() => this.onClickTrip(trip['trip_jkey'])}
              >
                {trip['departure_time']}
              </span>
            );
          })}
        </div>
      </div>
    )
  }

  renderItineraryList() {
    if (!this.state.hasLoadedItineraries) return (
      <div className="loading-itineraries">
        loading itineraries...
      </div>
    );
    if (Object.keys(this.state.tripsByItineraryId).length === 0) {
      return (
        <div className="no-itineraries">
          No itineraries found.
        </div>
      );
    }
    return (
      <div className="itinerary-list">
        {Object.keys(this.state.tripsByItineraryId).map((itineraryId) => {
          return this.renderItinerary(itineraryId);
        })}
      </div>
    );
  }

  render () {
    return (
      <div className="itinerarylistparent">
        {this.renderHeader()}
        {this.renderItineraryList()}
      </div>
    );
  }
}

export default ItineraryList;