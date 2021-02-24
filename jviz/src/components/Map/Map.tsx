import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapComponents from './MapComponents';
import './Map.css';

interface MapProps {
  tripJkey: string;
}

class Map extends React.Component<MapProps> {
  render() {
    return (
      <MapContainer
        className="map"
        center={[47.608013, -122.335167]} // change this
        zoom={13}
        scrollWheelZoom={true}
        key="map"
      >
        <TileLayer
          key="tileLayer"
          attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
        />
        <MapComponents
          tripJkey={this.props.tripJkey}
          key={this.props.tripJkey}
        />
      </MapContainer>
    );
  }
}

export default Map;