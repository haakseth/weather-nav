/* tslint:disable no-any */
import * as React from 'react';
import Drawer from 'material-ui/Drawer';
import List, { ListItem } from 'material-ui/List';
import Button from 'material-ui/Button';
import InboxIcon from 'material-ui-icons/Inbox';
import DraftsIcon from 'material-ui-icons/Drafts';
import LeftIcon from 'material-ui-icons/ChevronLeft';

class Sidebar extends React.Component<SidebarProps, any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <Drawer open={this.props.toggled} type="temporary">
        <Button onClick={this.props.close}>
          <LeftIcon />Close
        </Button>
        <List style={{ width: 250 }}>
          <ListItem button={true}>
            <InboxIcon />
            Inbox
          </ListItem>
          <ListItem button={true}>
            <DraftsIcon />
            Drafts
          </ListItem>
        </List>
      </Drawer>
    );
  }
}

export default Sidebar;
interface SidebarProps {
  toggled: boolean;
  close: any;
}
