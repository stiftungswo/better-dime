import { Theme, withWidth } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { MainStore } from '../stores/mainStore';
import compose from '../utilities/compose';
import { ChevronLeftIcon } from './icons';
import { Navigation } from './Navigation';

export const drawerWidth = 252;

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    // HAX
    mainContent: {
      textAlign: 'left',
      padding: theme.spacing(2),
    },
    overflowX: {
      overflowX: 'auto',
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
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Drawer
            variant={'permanent'}
            className={classNames(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: classNames({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
            open={open}
            anchor={'left'}
          >
            <List component={'nav'} disablePadding>
              <div className={classes.toolbar}>
                <IconButton onClick={this.handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </div>

              <Divider />

              <Navigation drawerOpen={open} handleDrawerOpen={this.handleDrawerOpen} isAdmin={this.props.mainStore!.isAdmin} />
            </List>
          </Drawer>

          {children}
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(DimeLayout);
