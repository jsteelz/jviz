import React from 'react';
import { observer } from 'mobx-react';
import logo from './logo.svg';
import Map from './components/Map/Map';
import VizMenu from './components/VizMenu/VizMenu';
import RightMenu from './components/RightMenu/RightMenu';
import './App.css';
import { storeContext } from './store';

@observer
class App extends React.Component {
  static contextType = storeContext;

  displayTrip = (tripJkey: string) => {
    this.context.store.tripJkey = tripJkey;
  }

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );

  // testing
  render() {
    // for testing purposes only
    const stops = [
      {
        position: {lat: 47.6118013, lng: -122.335167},
        name: 'test 1',
        id: 'test 1'
      },
      {
        position: {lat: 47.608013, lng: -122.325167},
        name: 'test 2',
        id: 'test 2'
      }
    ];

    const shape = [{lat: 47.608013, lng: -122.325167}, {lat: 47.6118013, lng: -122.335167}];
  
    return (
      <div>
        <Map
          center={{lat: 47.608013, lng: -122.335167}}
          shape={shape}
          stops={stops}
        />
        <VizMenu
          displayTrip={this.displayTrip}
        />
        <RightMenu
          routeJkey={/*this.state.activeRouteJkey */ '218ac4a63e12f735131c342f1cd0335e' }
          tripJkey={/* this.state.activeTripJkey */ '662a6ef12a11b08d02f470710e4d40c7'}
          date="20210203"
        />
      </div>
    );
  }
}

export default App;
