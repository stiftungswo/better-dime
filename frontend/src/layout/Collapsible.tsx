import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { withStyles, WithStyles } from '@mui/styles';
import * as React from 'react';
import { ArrowRightIcon, ExpandLessIcon, ExpandMoreIcon } from './icons';
import { styles } from './NavItem';

interface CollapsibleProps extends WithStyles<typeof styles> {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
  label: string;
  icon: React.ComponentType;
  children: React.ReactNode;
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
