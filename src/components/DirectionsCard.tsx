/* tslint:disable no-any */
import * as React from 'react';
import Card, { CardContent } from 'material-ui/Card';
import '../interfaces/OpenRouteService';

class DirectionsCard extends React.Component<
  DirectionsCardProps,
  DirectionsCardState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      mouseHover: false
    };
  }
  renderError() {
    if (this.props.error) {
      return (
        <p>Could not find directions, try to select points close to a road.</p>
      );
    }
    return null;
  }
  toggleHover() {
    this.setState({
      ...this.state,
      mouseHover: !this.state.mouseHover
    });
  }
  render() {
    let style = styles.component;
    if (this.state.mouseHover) {
      // style = styles.hover;
    }
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
          {this.props.steps.map((step, i) => {
            return <CardContent key={i}>{step.instruction}</CardContent>;
          })}
          <CardContent>{this.renderError()}</CardContent>
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
export default DirectionsCard;

interface DirectionsCardProps {
  error: string;
  steps: RouteStep[];
}

interface DirectionsCardState {
  mouseHover: boolean;
}
