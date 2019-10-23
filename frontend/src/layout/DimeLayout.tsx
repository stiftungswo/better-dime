import { Theme, WithStyles, withWidth } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import Divider from '@material-ui/core/Divider/Divider';
import Drawer from '@material-ui/core/Drawer/Drawer';
import IconButton from '@material-ui/core/IconButton/IconButton';
import List from '@material-ui/core/List';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { MainStore } from '../stores/mainStore';
import compose from '../utilities/compose';
import { ChevronLeftIcon } from './icons';
import { Navigation } from './Navigation';

export const drawerWidth = 240;

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    title: {
      flexGrow: 1,
    },
    contentPaper: {
      padding: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
    },
  });

interface Props extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  mainStore?: MainStore;
  width?: Breakpoint;
}

@compose(
  withWidth(),
  inject('mainStore'),
  observer,
)
class DimeLayout extends React.Component<Props> {
  handleDrawerOpen = () => {
    this.props.mainStore!.drawerOpen = true;
  }

  handleDrawerClose = () => {
    this.props.mainStore!.drawerOpen = false;
  }

  render() {
    const { children, classes } = this.props;
    const open = this.props.mainStore!.drawerOpen;

    return (
      <>
        <CssBaseline/>
        <div className={classes.root}>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon/>
              </IconButton>
            </div>

            <Divider/>

            <List component={'nav'} disablePadding>
              <Navigation
                drawerOpen={open}
                handleDrawerOpen={this.handleDrawerOpen}
                isAdmin={this.props.mainStore!.isAdmin}
              />
            </List>
          </Drawer>

          {children}
        </div>
      </>
    );
  }
}

export default withStyles(styles)(DimeLayout);
