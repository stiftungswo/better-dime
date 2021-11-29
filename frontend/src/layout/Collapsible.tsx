import { WithStyles } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse/Collapse';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';
import * as React from 'react';
import { ArrowRightIcon, ExpandLessIcon, ExpandMoreIcon } from './icons';
import { styles } from './NavItem';

interface CollapsibleProps extends WithStyles<typeof styles> {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
  label: string;
  icon: React.ComponentType;
}

interface CollapsibleState {
  open: boolean;
}

const listComponent: any = 'div'; // tslint:disable-line:no-any ; types seem wrong - this works well

class CollapsibleInner extends React.Component<CollapsibleProps, CollapsibleState> {
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
  }

  get open() {
    return this.state.open && this.props.drawerOpen;
  }

  render() {
    const Icon = this.props.icon || ArrowRightIcon;
    return (
      <>
        <ListItem button onClick={this.handleClick} className={this.props.classes.default}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={this.props.label} />
          {this.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={this.open} timeout={'auto'} unmountOnExit>
          <List component={listComponent} disablePadding>
            {this.props.children}
          </List>
        </Collapse>
      </>
    );
  }
}

export const Collapsible = withStyles(styles)(CollapsibleInner);
