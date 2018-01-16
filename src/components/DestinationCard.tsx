/* tslint:disable no-any */
import * as React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import { LngLat } from 'mapbox-gl';

class DestinationCard extends React.Component<
  DestinationCardProps,
  DestinationCardState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      mouseHover: false
    };
  }
  renderDestination() {
    if (this.props.destination !== undefined) {
      return (
        <p>
          {this.props.destination.lat.toFixed(3)},
          {this.props.destination.lng.toFixed(3)}
        </p>
      );
    }
    return <p>Not set yet. Click the map.</p>;
  }
  toggleHover() {
    this.setState({
      ...this.state,
      mouseHover: !this.state.mouseHover
    });
  }
  render() {
    let style = styles.component;
    // Uncomment to let card change color on mouse hover
    // if (this.state.mouseHover) {
    //   style = styles.hover;
    // }
    return (
      <div>
        <Card
          onMouseEnter={() => {
            this.toggleHover();
          }}
          onMouseLeave={() => {
            this.toggleHover();
          }}
          style={style}
        >
          <CardContent>
            {this.props.title}
            {this.renderDestination()}
          </CardContent>
        </Card>
      </div>
    );
  }
}
const styles = {
  component: {
    backgroundColor: 'rgb(240, 240, 240)'
  },
  hover: {
    backgroundColor: 'rgb(220, 220, 220)'
  }
};
export default DestinationCard;

interface DestinationCardProps {
  title: string;
  destination?: LngLat;
}

interface DestinationCardState {
  mouseHover: boolean;
}
