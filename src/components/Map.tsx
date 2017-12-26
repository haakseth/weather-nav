/* tslint:disable no-any */
/* tslint:disable no-console */
import * as React from 'react';
import * as mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import config from '../config.json';
import Button from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Sidebar from './Sidebar';
import { LngLat, MapMouseEvent } from 'mapbox-gl/dist/mapbox-gl';

(mapboxgl as any).accessToken = config.mapboxToken;

class Map extends React.Component<any, MapState> {
  map: mapboxgl.Map;
  mapContainer: any;
  constructor(props: any) {
    super(props);
    this.state = {
      lng: 10.2,
      lat: 56.2,
      zoom: 6.4,
      sidebarToggled: false
    };
  }

  componentWillMount() {
    fetch('http://freegeoip.net/json/')
      .then((response: any) => {
        var contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }
      })
      .then((json: GeoIp) => {
        this.setState({
          ...this.state,
          lng: json.longitude,
          lat: json.latitude
        });
      });
  }
  componentWillUpdate(nextProps: any, nextState: MapState) {
    if (this.state.lat !== nextState.lat || this.state.lng !== nextState.lng) {
      this.map.setCenter(new mapboxgl.LngLat(nextState.lng, nextState.lat));
      // this.map.setZoom(12);
    }
  }
  toggleSidebar() {
    if (this.state.sidebarToggled) {
      this.setState({
        ...this.state,
        sidebarToggled: false
      });
    } else {
      this.setState({
        ...this.state,
        sidebarToggled: true
      });
    }
  }
  closeSidebar() {
    this.setState({
      ...this.state,
      sidebarToggled: false
    });
  }
  addPopup(lngLat: LngLat) {
    let popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(lngLat)
      .setHTML(`<h3> Latitude: ${lngLat.lat}, Longitude: ${lngLat.lng}</h3><p>asdf</p>');
    popup.addTo(this.map);
  }
  componentDidMount() {
    let { lng, lat, zoom } = this.state;
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/haakseth/cjbl80njw2xie2rs7e364vgps',
      center: [lng, lat],
      zoom: zoom
    });

    this.map.on('move', () => {
      const center = this.map.getCenter();
      this.setState({
        ...this.state,
        lng: center.lng,
        lat: center.lat,
        zoom: this.map.getZoom()
      });
    });
    // let that = this;
    this.map.on('click', (event: MapMouseEvent) => {
      this.addPopup(event.lngLat);
    });
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    const style: any = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
      zIndex: 1
    };

    return (
      <div>
        <Button
          style={{ zIndex: 2 }}
          onClick={() => {
            this.toggleSidebar();
          }}
        >
          <MenuIcon />
        </Button>
        <Sidebar
          toggled={this.state.sidebarToggled}
          close={() => {
            this.closeSidebar();
          }}
        />
        <div style={style} ref={el => (this.mapContainer = el)} />
      </div>
    );
  }
}

export default Map;

interface MapState {
  lng: number;
  lat: number;
  zoom: number;
  sidebarToggled: boolean;
}

interface GeoIp {
  ip: string;
  country_code: string;
  country_name: string;
  region_code: string;
  region_name: string;
  city: string;
  zip_code: string;
  time_zone: string;
  latitude: number;
  longitude: number;
  metro_code: number;
}
