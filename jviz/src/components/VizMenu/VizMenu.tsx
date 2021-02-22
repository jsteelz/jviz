import React from 'react';
import { observer } from 'mobx-react';
import './VizMenu.css';
import ValidatedInput from '../ValidatedInput/ValidatedInput';
import SearchableList from '../SearchableList/SearchableList';
import ItineraryList from '../ItineraryList/ItineraryList';
import { Route } from '../common/GtfsTypes';
import getJsonData from '../../components/common/getJsonData';
import VizStore from '../../store/store';

interface VizMenuState {
  routes: Route[];
}

@observer
class VizMenu extends React.Component<any, VizMenuState> {
  constructor(props: any) {
    super(props);

    this.state = {
      routes: [],
    }
  }

  createListElements = () => {
    return this.state.routes.map((route) => {
      return {
        id: route.route_jkey,
        listKey: route.route_short_name,
        listValue: route.route_long_name,
      }
    });
  }

  async componentDidMount() {
    const routeListInfo = await getJsonData('.visualizefiles/routes/route_list_info.json');

    this.setState({
      routes: routeListInfo,
    });
  }

  routeSelected = (routeJkey: string) => {
    VizStore.route = this.state.routes.find((route) => route.route_jkey === routeJkey);
    console.log(VizStore.route);
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
    VizStore.date = date;
  }

  onTimeEntered = (time: string) => {
    let date = VizStore.date;
    if (!date) {
      const dateObj = new Date();
      let day = String(dateObj.getDate());
      if (day.length === 1) day = `0${day}`;
      let month = String(dateObj.getMonth() + 1);
      if (month.length === 1) month = `0${month}`;
      const year = String(dateObj.getFullYear());
      date = `${year}${month}${day}`;
    }
    VizStore.time = time;
    VizStore.date = date;
    console.log(VizStore.time);
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
      />
    );
  }

  renderItineraries = () => {
    return (
      <ItineraryList/>
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
        validateInput={() => true}
        invalidMessage=''
        onEnterData={() => null}
        placeholder="enter a trip id"
      />
    );
  }

  render() {
    return (
      <div className="vizmenu">
        {this.renderTripSelector()}
        <br/>or select:
        {this.renderDatePicker()}
        {this.renderTimePicker()}
        {this.renderRoutes()}
        <ItineraryList/>
      </div>
    );
  }
}

export default VizMenu;
