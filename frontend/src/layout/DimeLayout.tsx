import * as React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import { Theme, WithStyles, withWidth } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import DimeTheme from './DimeTheme';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Drawer from '@material-ui/core/Drawer/Drawer';
import Divider from '@material-ui/core/Divider/Divider';
import { Navigation } from './Navigation';
import compose from '../utilities/compose';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../stores/mainStore';
import { ChevronLeftIcon } from './icons';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

export const drawerWidth = 240;

export const styles = ({ palette, spacing, breakpoints, mixins, transitions, zIndex, shape }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...mixins.toolbar,
    },
    drawerPaper: {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: transitions.create('width', {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      transition: transitions.create('width', {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
      width: spacing.unit * 7,
      [breakpoints.up('sm')]: {
        width: spacing.unit * 9,
      },
    },
    appBarSpacer: mixins.toolbar,
    content: {
      flexGrow: 1,
      [breakpoints.down('sm')]: {
        padding: spacing.unit,
      },
      [breakpoints.up('md')]: {
        padding: spacing.unit * 3,
      },
      height: '100vh',
      overflow: 'auto',
    },
    chartContainer: {
      marginLeft: -22,
    },
    tableContainer: {
      height: 320,
    },
    h5: {
      marginBottom: spacing.unit * 2,
    },
    mainContent: {
      textAlign: 'left',
      padding: spacing.unit * 2,
    },
    progress: {
      margin: spacing.unit * 2,
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
  observer
)
class DimeLayout extends React.Component<Props> {
  public handleDrawerOpen = () => {
    this.props.mainStore!.drawerOpen = true;
  };

  public handleDrawerClose = () => {
    this.props.mainStore!.drawerOpen = false;
  };

  public render() {
    const { children, classes } = this.props;
    const open = this.props.mainStore!.drawerOpen;

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <Drawer
            variant={this.props.width !== 'xs' ? 'permanent' : 'temporary'}
            classes={this.props.width !== 'xs' ? { paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose) } : undefined}
            open={open}
            anchor={'left'}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>

            <Divider />

            <Navigation drawerOpen={open} handleDrawerOpen={this.handleDrawerOpen} isAdmin={this.props.mainStore!.isAdmin} />
          </Drawer>

          {children}
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles(DimeTheme))(DimeLayout);
