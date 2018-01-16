/* tslint:disable no-any */
import * as React from 'react';
import MediaQuery from 'react-responsive';

import { CircularProgress } from 'material-ui/Progress';
import List, { ListItem } from 'material-ui/List';
import Button from 'material-ui/Button';
import LeftIcon from 'material-ui-icons/ChevronLeft';
import DownIcon from 'material-ui-icons/KeyboardArrowDown';
import UpIcon from 'material-ui-icons/KeyboardArrowUp';
import CloseIcon from 'material-ui-icons/Close';
import { LngLat } from 'mapbox-gl';
import DestinationCard from './DestinationCard';
import DirectionsCard from './DirectionsCard';

class Sidebar extends React.Component<SidebarProps, SidebarState> {
  constructor(props: any) {
    super(props);
    this.state = {
      closeButtonHover: false,
      resetButtonHover: false,
      drawerHeight: DrawerHeight.medium
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
  downButtonClicked() {
    switch (this.state.drawerHeight) {
      case DrawerHeight.full:
        this.setState({
          ...this.state,
          drawerHeight: DrawerHeight.medium
        });
        break;
      case DrawerHeight.medium:
        this.setState({
          ...this.state,
          drawerHeight: DrawerHeight.short
        });
        break;
      default:
        this.props.close();
        break;
    }
  }
  upButtonClicked() {
    switch (this.state.drawerHeight) {
      case DrawerHeight.short:
        this.setState({
          ...this.state,
          drawerHeight: DrawerHeight.medium
        });
        break;
      case DrawerHeight.medium:
        this.setState({
          ...this.state,
          drawerHeight: DrawerHeight.full
        });
        break;
      default:
        break;
    }
  }

  renderUpDownButtons() {
    switch (this.state.drawerHeight) {
      case DrawerHeight.medium:
        return (
          <div>
            <ListItem
              button={true}
              onClick={() => {
                this.upButtonClicked();
              }}
            >
              <UpIcon />
            </ListItem>
            <ListItem
              button={true}
              onClick={() => {
                this.downButtonClicked();
              }}
            >
              <DownIcon />
            </ListItem>
          </div>
        );
      case DrawerHeight.full:
        return (
          <div>
            <ListItem
              button={true}
              onClick={() => {
                this.downButtonClicked();
              }}
            >
              <DownIcon />
            </ListItem>
          </div>
        );
      default:
        return (
          <div>
            <ListItem
              button={true}
              onClick={() => {
                this.upButtonClicked();
              }}
            >
              <UpIcon />
            </ListItem>
            <ListItem
              button={true}
              onClick={() => {
                this.downButtonClicked();
              }}
            >
              <DownIcon />
            </ListItem>
          </div>
        );
    }
  }
  renderList() {
    return (
      <div>
        <MediaQuery query="(min-width: 600px)">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <Button
              style={{ left: 0 }}
              onClick={this.props.close}
              onMouseEnter={() => {
                this.toggleClosebuttonHover();
              }}
              onMouseLeave={() => {
                this.toggleClosebuttonHover();
              }}
            >
              <LeftIcon />
            </Button>
            <Button style={{ right: 0 }} onClick={this.props.resetAndClose}>
              <CloseIcon />
            </Button>
          </div>
        </MediaQuery>

        <MediaQuery query="(max-width: 600px)">
          {this.renderUpDownButtons()}
        </MediaQuery>
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
          style={styles.closeButton}
        >
          Reset
        </ListItem>
      </div>
    );
  }
  renderSidebar(smallScreen: boolean) {
    if (smallScreen) {
      switch (this.state.drawerHeight) {
        case DrawerHeight.short:
          return (
            <div
              style={{
                ...styles.component,
                ...styles.componentSmallScreen,
                height: '20%'
              }}
            >
              <List>{this.renderList()}</List>
            </div>
          );
        case DrawerHeight.medium:
          return (
            <div
              style={{
                ...styles.component,
                ...styles.componentSmallScreen,
                height: '60%'
              }}
            >
              <List>{this.renderList()}</List>
            </div>
          );
        default:
          return (
            <div
              style={{
                ...styles.component,
                ...styles.componentSmallScreen,
                height: '90%'
              }}
            >
              <List>{this.renderList()}</List>
            </div>
          );
      }
    }
    return (
      <div style={styles.component}>
        <List>{this.renderList()}</List>
      </div>
    );
  }
  render() {
    if (this.props.toggled) {
      return (
        <div
          style={{
            display: 'flex'
          }}
        >
          <MediaQuery query="(min-width: 600px)">
            {this.renderSidebar(false)}
          </MediaQuery>
          <MediaQuery query="(max-width: 600px)">
            {this.renderSidebar(true)}
          </MediaQuery>
        </div>
      );
    }
    return null;
  }
}

const styles = {
  component: {
    height: '100%',
    top: 0,
    width: 300,
    position: 'fixed' as 'fixed',
    zIndex: 2,
    left: 0,
    backgroundColor: 'rgb(240, 240, 240)',
    overflowX: 'hidden' as 'hidden',
    transition: '0.5s'
  },
  componentSmallScreen: {
    height: '20%' /* 100% Full-height */,
    width: '100%' /* 0 width - change this with JavaScript */,
    top: undefined,
    bottom: 0
  },
  closeButton: {
    // backgroundColor: 'rgb(240, 240, 240)'
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
enum DrawerHeight {
  short,
  medium,
  full
}
interface SidebarState {
  closeButtonHover: boolean;
  resetButtonHover: boolean;
  drawerHeight: DrawerHeight;
}
