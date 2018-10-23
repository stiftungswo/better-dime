import * as React from 'react';
import { ComponentType, Fragment } from 'react';
import { ArrowRight, ExpandLess, ExpandMore } from '@material-ui/icons';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import Collapse from '@material-ui/core/Collapse/Collapse';
import List from '@material-ui/core/List/List';

interface CollapsibleProps {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
  label: string;
  icon: ComponentType;
}

interface CollapsibleState {
  open: boolean;
}

export class Collapsible extends React.Component<CollapsibleProps, CollapsibleState> {
  state = {
    open: false,
  };

  handleClick = () => {
    if (!this.props.drawerOpen) {
      this.setState({ open: true });
    } else {
      this.setState(state => ({ open: !state.open }));
    }
    this.props.handleDrawerOpen();
  };

  get open() {
    return this.state.open && this.props.drawerOpen;
  }

  public render() {
    const Icon = this.props.icon || ArrowRight;
    return (
      <Fragment>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText inset primary={this.props.label} />
          {this.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.open} timeout={'auto'} unmountOnExit>
          <List component={'div'} disablePadding>
            {this.props.children}
          </List>
        </Collapse>
      </Fragment>
    );
  }
}
