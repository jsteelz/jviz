import React from 'react';
import Map from './components/Map/Map';
import VizMenu from './components/VizMenu/VizMenu';
import RightMenu from './components/RightMenu/RightMenu';
import './App.css';
import { Route } from './components/common/GtfsTypes';
import getJsonData from './components/common/getJsonData';

interface AppState {
  currentDate: string;
  currentTime: string;
  currentRoute: Route | undefined;
  currentTrip: string;
  routes: Route[];
}

class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentDate: '',
      currentTime: '',
      currentRoute: undefined,
      currentTrip: '',
      routes: [],
    };
  }

  async componentDidMount() {
    const routeListInfo = await getJsonData('.visualizefiles/routes/route_list_info.json');

    this.setState({
      routes: routeListInfo,
    });
  }

  onSelectDate = (selectedDate : string) => {
    this.setState({
      currentDate: selectedDate,
    });
  }

  onSelectTime = (selectedTime : string) => {
    this.setState({
      currentTime: selectedTime,
    });
  }

  onSelectRoute = (selectedRoute : Route | undefined) => {
    let currentTrip = this.state.currentTrip;
    if (selectedRoute === undefined) currentTrip = '';
  
    this.setState({
      currentRoute: selectedRoute,
      currentTrip: currentTrip,
    });
  }

  onSelectTrip = (selectedTrip : string) => {
    this.setState({
      currentTrip: selectedTrip,
    });
  }

  render() {
    return (
      <div>
        <Map
          tripJkey={this.state.currentTrip}
        />
        <VizMenu
          onSelectDate={this.onSelectDate}
          onSelectTime={this.onSelectTime}
          onSelectRoute={this.onSelectRoute}
          onSelectTrip={this.onSelectTrip}
          routes={this.state.routes}
        />
        <RightMenu
          route={this.state.currentRoute}
          tripJkey={this.state.currentTrip}
          date="20210203"
        />
      </div>
    );
  }
}

export default App;
