import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import StopIcon from './StopIcon';
import './Map.css';

interface LatLng {
  lat: number;
  lng: number;
}

interface Stop {
  position: LatLng;
  name: string;
  id: string;
}

interface MapProps {
  center: LatLng;
  shape: LatLng[];
  stops: Stop[];
}

class Map extends React.Component<MapProps> {
  renderShape = () => {
    return (
      <Polyline
        positions={this.props.shape.map((latLng) => [latLng.lat, latLng.lng])}
        color="#14446b"
        weight={2.5}
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
        <Popup key={`stop-popup-${stop.id}`}>
          <span className="stopname">{stop.name}</span> ({stop.id}) <br />
          {stop.position.lat}, {stop.position.lng}
        </Popup>
      </Marker>
    );
  }

  renderStops = () => {
    return this.props.stops.map((stop) => {
      return this.renderStop(stop);
    });
  }

  render() {
    return (
      <MapContainer
        className="map"
        center={[this.props.center.lat, this.props.center.lng]}
        zoom={13}
        scrollWheelZoom={true}
        key="map"
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