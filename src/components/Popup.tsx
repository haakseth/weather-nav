/* tslint:disable no-any */
/* tslint:disable no-console */
import * as React from 'react';
import Button from 'material-ui/Button';
import * as mapboxgl from 'mapbox-gl';

class Popup extends React.Component<PopupProps, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <div>
        <h3>
          {this.props.lngLat.lat.toFixed(4)}, {this.props.lngLat.lng.toFixed(4)}
        </h3>
        <Button
          onClick={() => {
            console.log('hei');
          }}
        >
          Set as origin
        </Button>
        <Button>Set as destination</Button>
      </div>
    );
  }
}

export default Popup;
interface PopupProps {
  lngLat: mapboxgl.LngLat;
}
