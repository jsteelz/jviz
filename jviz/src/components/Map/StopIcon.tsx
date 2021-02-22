import L from 'leaflet';
import './StopIcon.css';
 
const stopIcon = new L.Icon({
  iconUrl: '/img/stop.png',
  iconSize: [25, 25],
  className: 'stop-icon'
});

export default stopIcon;