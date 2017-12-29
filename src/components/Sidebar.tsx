/* tslint:disable no-any */
import * as React from 'react';
import { CircularProgress } from 'material-ui/Progress';
import Drawer from 'material-ui/Drawer';
import List, { ListItem } from 'material-ui/List';
import LeftIcon from 'material-ui-icons/ChevronLeft';
import { LngLat } from 'mapbox-gl';
import DestinationCard from './DestinationCard';
import DirectionsCard from './DirectionsCard';

class Sidebar extends React.Component<SidebarProps, SidebarState> {
  constructor(props: any) {
    super(props);
    this.state = {
      closeButtonHover: false,
      resetButtonHover: false
    };
  }
  toggleClosebuttonHover() {
    this.setState({
      ...this.state,
      closeButtonHover: !this.state.closeButtonHover
    });
  }
  toggleResetButtonHover() {
    this.setState({
      ...this.state,
      resetButtonHover: !this.state.resetButtonHover
    });
  }
  renderLoader() {
    if (this.props.loading) {
      return (
        <ListItem>
          <CircularProgress />
        </ListItem>
      );
    }
    return <ListItem />;
  }
  render() {
    let closeButtonStyle = styles.closeButton;
    if (this.state.closeButtonHover) {
      closeButtonStyle = styles.closeButtonHover;
    }
    let resetButtonStyle = styles.closeButton;
    if (this.state.resetButtonHover) {
      resetButtonStyle = styles.closeButtonHover;
    }
    return (
      <Drawer open={this.props.toggled} type="persistent">
        <List style={styles.component}>
          <ListItem
            button={true}
            onClick={this.props.close}
            style={closeButtonStyle}
            onMouseEnter={() => {
              this.toggleClosebuttonHover();
            }}
            onMouseLeave={() => {
              this.toggleClosebuttonHover();
            }}
          >
            <LeftIcon />
          </ListItem>
          <DestinationCard
            title={'Origin'}
            destination={this.props.originPoint}
          />
          <DestinationCard
            title={'Destination'}
            destination={this.props.destinationPoint}
          />
          <DirectionsCard
            error={this.props.directionsError}
            steps={this.props.directionSteps}
          />
          {this.renderLoader()}
          <ListItem
            button={true}
            onClick={this.props.resetAndClose}
            style={resetButtonStyle}
            onMouseEnter={() => {
              this.toggleResetButtonHover();
            }}
            onMouseLeave={() => {
              this.toggleResetButtonHover();
            }}
          >
            Reset
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

const styles = {
  component: {
    width: 250,
    backgroundColor: 'rgb(240, 240, 240)'
  },
  closeButton: {
    backgroundColor: 'rgb(240, 240, 240)'
  },
  closeButtonHover: {
    backgroundColor: 'rgb(220, 220, 220)'
  }
};
export default Sidebar;

interface SidebarProps {
  toggled: boolean;
  close: any;
  resetAndClose: any;
  originPoint?: LngLat;
  destinationPoint?: LngLat;
  loading: boolean;
  directionsError: string;
  directionSteps: RouteStep[];
}
interface SidebarState {
  closeButtonHover: boolean;
  resetButtonHover: boolean;
}
