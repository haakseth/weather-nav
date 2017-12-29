/* tslint:disable no-any */
/* tslint:disable no-console */
import * as React from 'react';
import { renderToString } from 'react-dom/server';

import * as mapboxgl from 'mapbox-gl';
import { LngLat, MapMouseEvent, Marker, Layer } from 'mapbox-gl/dist/mapbox-gl';
import polyline from '@mapbox/polyline';
import 'mapbox-gl/dist/mapbox-gl.css';

import Button from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

import config from '../config.json';

import Sidebar from './Sidebar';
import Popup from './Popup';

import '../interfaces/OpenRouteService';
import '../interfaces/GeoIp';

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
      sidebarToggled: false,
      destinationPoint: undefined,
      originPoint: undefined,
      mapMarkers: [],
      directions: undefined,
      directionsLayer: undefined,
      loading: false
    };
  }
  renderPopupHtml(lngLat: LngLat) {
    return renderToString(<Popup lngLat={lngLat} />);
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
    }

    // add new markers:
    let newMarkers = nextState.mapMarkers.filter(
      e => !this.state.mapMarkers.find(a => e === a)
    );
    newMarkers.forEach(newMarker => {
      newMarker.addTo(this.map);
    });

    // remove removed layers:
    let removedMarkers = this.state.mapMarkers.filter(
      e => !nextState.mapMarkers.find(a => e === a)
    );
    removedMarkers.forEach(removedMarker => {
      removedMarker.remove();
    });

    if (!this.state.directionsLayer && nextState.directionsLayer) {
      this.map.addLayer(nextState.directionsLayer);
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

  resetAndClose() {
    if (this.state.directionsLayer) {
      this.map.removeLayer(this.state.directionsLayer.id);
    }
    this.setState({
      ...this.state,
      originPoint: undefined,
      destinationPoint: undefined,
      mapMarkers: [],
      sidebarToggled: false,
      directions: undefined,
      directionsLayer: undefined,
      loading: false
    });
  }

  addPopup(lngLat: LngLat) {
    let popup = new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(lngLat)
      .setHTML(this.renderPopupHtml(lngLat));
    popup.addTo(this.map);
  }

  addOriginOrDestination(lngLat: LngLat) {
    // add origin:
    if (!this.state.originPoint) {
      this.setState({
        ...this.state,
        originPoint: lngLat,
        sidebarToggled: true
      });
      // add destination and fetch directions:
    } else if (!this.state.destinationPoint) {
      this.setState({
        ...this.state,
        destinationPoint: lngLat,
        sidebarToggled: true,
        loading: true
      });
      fetch(
        `https://api.openrouteservice.org/directions?api_key=${
          config.openRoutingToken
        }&coordinates=${this.state.originPoint.lng}%2C${
          this.state.originPoint.lat
        }%7C${lngLat.lng}%2C${lngLat.lat}&profile=driving-car`
      )
        .then((response: any) => {
          var contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          }
        })
        .then((directions: Directions) => {
          console.log(directions);
          if (!directions.error) {
            this.setState({
              ...this.state,
              loading: false,
              directions: directions,
              directionsLayer: {
                id: 'route_' + new Date(),
                type: 'line',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: polyline.toGeoJSON(directions.routes[0].geometry)
                  }
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': '#888',
                  'line-width': 8
                }
              }
            });
          } else {
            this.setState({
              ...this.state,
              loading: false
            });
          }
        });
      // start over:
    } else {
      if (this.state.directionsLayer) {
        this.map.removeLayer(this.state.directionsLayer.id);
      }
      this.setState({
        ...this.state,
        destinationPoint: undefined,
        originPoint: undefined,
        directionsLayer: undefined
      });
      this.addOriginOrDestination(lngLat);
    }
    let markers = Array<Marker>();
    if (this.state.originPoint) {
      markers.push(new Marker().setLngLat(this.state.originPoint));
    }
    if (this.state.destinationPoint) {
      markers.push(new Marker().setLngLat(this.state.destinationPoint));
    }
    this.setState({
      ...this.state,
      mapMarkers: markers
    });
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
      // this.addPopup(event.lngLat);
      this.addOriginOrDestination(event.lngLat);
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
          resetAndClose={() => {
            this.resetAndClose();
          }}
          originPoint={this.state.originPoint}
          destinationPoint={this.state.destinationPoint}
          loading={this.state.loading}
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
  originPoint?: LngLat;
  destinationPoint?: LngLat;
  mapMarkers: Array<Marker>;
  directions?: Directions;
  loading: boolean;
  directionsLayer?: Layer;
}
