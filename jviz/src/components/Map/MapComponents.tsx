import React from 'react';
import { LayerGroup, Marker, Popup, Polyline } from 'react-leaflet';
import StopIcon from './StopIcon';
import './Map.css';
import getJsonData from '../common/getJsonData';

interface LatLng {
  lat: number;
  lng: number;
}

interface Stop {
  position: LatLng;
  time: string;
  name: string;
  id: string;
}

interface MapComponentProps {
  tripJkey: string;
}

interface MapComponentState {
  shape: LatLng[];
  stops: Stop[];
}

class Map extends React.Component<MapComponentProps, MapComponentState> {
  constructor(props: any) {
    super(props);

    this.state = {
      shape: [],
      stops: [],
    };
  }

  async componentDidMount() {
    if (!this.props.tripJkey) return;
  
    let shape = [];
    const tripInfo = await getJsonData(`.visualizefiles/trips/${this.props.tripJkey}.json`);
    const itinerary = await getJsonData(`.visualizefiles/itineraries/${tripInfo.route_jkey}/itin_${tripInfo.itinerary_id}.json`);
    const stopsInfo = await getJsonData(`.visualizefiles/stops/stops.json`);

    const stops: Stop[] = this.constructStopsFromItinerary(tripInfo, itinerary, stopsInfo);
    if (!itinerary.shape_jkey) shape = this.constructShapeFromStops(stops);
    else shape = this.convertGeoJsonToShape(await getJsonData(`.visualizefiles/shapes/${itinerary.shape_jkey}.json`));
  
    this.setState({
      shape: shape,
      stops: stops,
    });
  }

  constructStopsFromItinerary(tripInfo: any, itinerary: any, stopsInfo: any) {
    const stops: Stop[] = [];
    const timingList = tripInfo['timing_list'];
    const stopList = itinerary['stop_list'];
    const departureTime = tripInfo['departure_time'];

    if (stopList.length !== timingList.length) {
      alert('Stop list and list of stop times are different lengths. Error in processed data.');
      return stops;
    }

    for (let i = 0; i < stopList.length; i += 1) {
      const stopInfo = stopList[i];
      stops.push({
        position: {
          lat: stopInfo[1], 
          lng: stopInfo[2],
        },
        name: stopsInfo[stopInfo[0]]['stop_name'],
        time: this.getNextTime(departureTime, timingList[i]),
        id: stopInfo[0],
      });
    }

    return stops;
  }

  // calculate the time after a HH:MM:SS given a number of seconds after it
  getNextTime(prevTime: string, secOffset: number) {
    const timeSplit = prevTime.split(':');
    const hh = parseInt(timeSplit[0]);
    const mm = parseInt(timeSplit[1]);
    const ss = parseInt(timeSplit[2]);
    const originalTimeSeconds = ss + mm * 60 + hh * 60 * 60;
    const nextTime = originalTimeSeconds + secOffset;
    let finalSeconds = nextTime % 60;
    let finalMinutes = Math.floor(nextTime / 60);
    const finalHours = Math.floor(finalMinutes / 60);
    finalMinutes = finalMinutes % 60;
    let printSeconds = String(finalSeconds);
    let printMinutes = String(finalMinutes);

    if (finalSeconds < 10) {
      printSeconds = '0' + String(finalSeconds);
    }
    if (finalMinutes < 10) {
      printMinutes = '0' + String(finalMinutes);
    }

    return `${finalHours}:${printMinutes}:${printSeconds}`;
  }

  constructShapeFromStops(stopList: Stop[]) {
    const coordinates: LatLng[] = [];
  
    stopList.forEach((stopInfo: Stop) => {
      coordinates.push({
        lat: stopInfo.position.lat,
        lng: stopInfo.position.lng
      });
    });
  
    return coordinates;
  }

  convertGeoJsonToShape(shape: any) {
    if (!shape) return [];
  
    const rawCoordinates: any = shape.geometry.coordinates;
    const coordinates: LatLng[] = [];

    rawCoordinates.forEach((coord: any) => {
      coordinates.push({
        lat: coord[1],
        lng: coord[0],
      });
    });

    return coordinates;
  }

  renderShape = () => {
    if (!this.state.shape.length) return null;
    return (
      <Polyline
        positions={this.state.shape.map((latLng) => [latLng.lat, latLng.lng])}
        color="#30b566"
        weight={5}
        lineCap="round"
        smoothFactor={2.5}
      />
    );
  }

  renderStop = (stop: Stop) => {
    return (
      <Marker
        position={[stop.position.lat, stop.position.lng]}
        icon={StopIcon}
        key={`stop-marker-${stop.id}`}
      >
        <Popup 
          key={`stop-time-popup-${stop.id}-${stop.time}`}
          autoClose={false} // does not work as intended.
        >
          <span className="time">{stop.time}</span>
        </Popup>
        <Popup key={`stop-popup-${stop.id}`}>
          <span className="stopname">{stop.name}</span> ({stop.id}) <br />
          {stop.position.lat}, {stop.position.lng}
        </Popup>
      </Marker>
    );
  }

  renderStops = () => {
    if (!this.state.stops.length) return null;
    return this.state.stops.map((stop) => {
      return this.renderStop(stop);
    });
  }

  render() {
    return (
      <LayerGroup>
        {this.renderShape()}
        {this.renderStops()}
      </LayerGroup>
    );
  }
}

export default Map;