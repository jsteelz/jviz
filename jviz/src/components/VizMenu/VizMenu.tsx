import React from 'react';
import './VizMenu.css';
import ValidatedInput from '../ValidatedInput/ValidatedInput';
import SearchableList from '../SearchableList/SearchableList';
import ItineraryList from '../ItineraryList/ItineraryList';
import { Route } from '../common/GtfsTypes';
import getJsonData from '../common/getJsonData';

interface VizMenuProps {
  routes: Route[];
  onSelectDate(date: string): void;
  onSelectTime(time: string): void;
  onSelectRoute(route: Route | undefined): void;
  onSelectTrip(trip: string): void;
}

interface VizMenuState {
  currentRoute: Route | undefined;
  currentDate: string;
  currentTime: string;
  currentTrip: string;
  hasLoadedTripMappings: boolean;
  tripJkeyByTripId: any;
}

class VizMenu extends React.Component<VizMenuProps, VizMenuState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentRoute: undefined,
      currentDate: '',
      currentTime: '',
      currentTrip: '',
      hasLoadedTripMappings: false,
      tripJkeyByTripId: undefined,
    };
  }

  async componentDidMount() {
    const tripJkeyByTripId = getJsonData(`.visualizefiles/trips/trip_jkey_by_trip_id.json`);

    this.setState({
      hasLoadedTripMappings: true,
      tripJkeyByTripId: tripJkeyByTripId,
    });
  }

  createListElements = () => {
    return this.props.routes.map((route) => {
      return {
        id: route.route_jkey,
        listKey: route.route_short_name,
        listValue: route.route_long_name,
      }
    });
  }

  routeSelected = async (routeJkey: string) => {
    const currentRoute = this.props.routes.find((route) => route.route_jkey === routeJkey);

    this.setState({
      currentRoute: currentRoute,
    });

    this.props.onSelectRoute(currentRoute);
  }

  // Todo: make the date and time checkers stricter
  isValidDate = (date: string) => {
    return /^\d{8}$/.test(date);
  }

  isValidTime = (time: string) => {
    return /^\d{2}:\d{2}$/.test(time)
      && parseInt(time.substring(0, 2)) < 30
      && parseInt(time.substring(3, 5)) < 60;
  }

  onDateEntered = (date: string) => {
    this.setState({
      currentDate: date,
    });

    this.props.onSelectDate(date);
  }

  onTimeEntered = (time: string) => {
    let date = this.state.currentDate;
    if (!date) {
      const dateObj = new Date();
      let day = String(dateObj.getDate());
      if (day.length === 1) day = `0${day}`;
      let month = String(dateObj.getMonth() + 1);
      if (month.length === 1) month = `0${month}`;
      const year = String(dateObj.getFullYear());
      date = `${year}${month}${day}`;
    }

    this.setState({
      currentDate: date,
    });
  
    this.setState({
      currentTime: time,
    });

    this.props.onSelectDate(date);
    this.props.onSelectTime(time);
  }

  onResetRoutes = () => {
    this.setState({
      currentRoute: undefined,
      currentTrip: '',
    });

    this.props.onSelectRoute(undefined);
  };

  onTripEntered = (tripId: string) => {
    this.onTripSelected(this.state.tripJkeyByTripId[tripId]);
  }

  tripIdIsValid = (tripId: string) => {
    return this.state.tripJkeyByTripId[tripId] ? true : false;
  }

  onTripSelected = (tripJkey: string) => {
    this.setState({
      currentTrip: tripJkey
    });

    this.props.onSelectTrip(tripJkey);
  }

  renderDatePicker = () => {
    return (
      <ValidatedInput
        title="date (optional)"
        validateInput={this.isValidDate}
        invalidMessage='invalid date entered'
        onEnterData={this.onDateEntered}
        placeholder="yyyymmdd only"
      />
    );
  }

  renderRoutes = () => {
    return (
      <SearchableList
        title="route"
        listElements={this.createListElements()}
        onElementClicked={this.routeSelected}
        onReset={this.onResetRoutes}
      />
    );
  }

  renderItineraries = () => {
    if (!this.state.currentRoute) return null;
    return (
      <ItineraryList key={`${this.state.currentRoute}-${this.state.currentDate}-${this.state.currentTime}`}
        route={this.state.currentRoute}
        date={this.state.currentDate}
        time={this.state.currentTime}
        onTripClicked={this.onTripSelected}
      />
    );
  }

  renderTimePicker = () => {
    return (
      <ValidatedInput
        title="time (optional)"
        validateInput={this.isValidTime}
        invalidMessage='invalid time entered'
        onEnterData={this.onTimeEntered}
        placeholder="hh:mm only"
      />
    );
  }

  renderTripSelector = () => {
    return (
      <ValidatedInput
        title="input a trip id"
        validateInput={this.state.tripJkeyByTripId ? this.tripIdIsValid : () => true}
        invalidMessage='invalid trip id entered'
        onEnterData={this.state.tripJkeyByTripId ? this.onTripEntered : () => null}
        placeholder="enter a trip id"
      />
    );
  }

  render() {
    if (!this.state.hasLoadedTripMappings) return (
      <div className="vizmenu">
        loading...
      </div>
    );
    return (
     <div className="vizmenu">
        {this.renderTripSelector()}
        <br/>or select:
        {this.renderDatePicker()}
        {this.renderTimePicker()}
        {this.renderRoutes()}
        {this.renderItineraries()}
      </div>
    );
  }
}

export default VizMenu;