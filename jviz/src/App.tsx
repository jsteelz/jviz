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
    let routeListInfo = await getJsonData('.visualizefiles/routes/route_list_info.json');

    while (routeListInfo === null) {
      await this.sleep(1000);
      routeListInfo = await getJsonData('.visualizefiles/routes/route_list_info.json');
    }

    this.setState({
      routes: routeListInfo,
    });
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onSelectDate = (selectedDate : string) => {
    this.setState({
      currentDate: selectedDate,
      currentTrip: '',
    });
  }

  onSelectTime = (selectedTime : string) => {
    this.setState({
      currentTime: selectedTime,
      currentTrip: '',
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
          key={this.state.currentTrip}
        />
        <VizMenu
          onSelectDate={this.onSelectDate}
          onSelectTime={this.onSelectTime}
          onSelectRoute={this.onSelectRoute}
          onSelectTrip={this.onSelectTrip}
          routes={this.state.routes}
        />
        <RightMenu
          key={`${this.state.currentDate}-${this.state.currentTrip}-${this.state.currentRoute}`}
          route={this.state.currentRoute}
          routes={this.state.routes}
          tripJkey={this.state.currentTrip}
          date={this.state.currentDate}
        />
      </div>
    );
  }
}

export default App;
