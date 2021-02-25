import React from 'react';
import { Tooltip, MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import StopIcon from './StopIcon';
import getJsonData from '../common/getJsonData';
import './Map.css';

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

interface MapProps {
  tripJkey: string;
}

interface MapState {
  bounds: any;
  shape: LatLng[];
  stops: Stop[];
}

class Map extends React.Component<MapProps, MapState> {
  constructor(props: any) {
    super(props);

    this.state = {
      bounds: undefined,
      shape: [],
      stops: [],
    }
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
      bounds: this.getShapeBounds(shape),
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

  getShapeBounds(shape: LatLng[]) {
    let maxLat, maxLng, minLat, minLng;

    for (const latLng of shape) {
      if (!maxLat) maxLat = latLng.lat;
      if (!maxLng) maxLng = latLng.lng;
      if (!minLat) minLat = latLng.lat;
      if (!minLng) minLng = latLng.lng;

      if (latLng.lat < minLat) minLat = latLng.lat;
      if (latLng.lng < minLng) minLng = latLng.lng;
      if (latLng.lat > maxLat) maxLat = latLng.lat;
      if (latLng.lng > maxLng) maxLng = latLng.lng;
    }

    return [[maxLat, maxLng], [minLat, minLng]];
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
        smoothFactor={1}
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
        {stop.time ? (<Tooltip
          permanent
          direction="top"
          opacity={1}
          offset={[0, -7]}
          key={`stop-time-popup-${stop.id}-${stop.time}`}
        >
          <span className="time">{stop.time}</span>
        </Tooltip>) : null}
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
      <MapContainer
        className="map"
        zoomControl={false}
        scrollWheelZoom={true}
        key={`${JSON.stringify(this.state.bounds)}-${this.props.tripJkey}`}
        bounds={this.state.bounds ? this.state.bounds : [[-90, 180], [90, 180]]}
        boundsOptions={this.state.bounds ? { padding: [250, 25]} : {}}
      >
        <TileLayer
          key="tileLayer"
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
        />
        {this.renderShape()}
        {this.renderStops()}
      </MapContainer>
    );
  }
}

export default Map;