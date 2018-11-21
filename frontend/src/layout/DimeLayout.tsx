import * as React from 'react';
import { Fragment } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import { CircularProgress, Theme, WithStyles, withWidth } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import DimeTheme from './DimeTheme';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Drawer from '@material-ui/core/Drawer/Drawer';
import Divider from '@material-ui/core/Divider/Divider';
import Paper from '@material-ui/core/Paper/Paper';
import { Navigation } from './Navigation';
import compose from '../utilities/compose';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../stores/mainStore';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography/Typography';
import { ChevronLeftIcon } from './icons';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

const drawerWidth = 240;

export const styles = ({ palette, spacing, breakpoints, mixins, transitions, zIndex, shape }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 8px',
      ...mixins.toolbar,
    },
    appBar: {
      zIndex: zIndex.drawer + 1,
      transition: transitions.create(['width', 'margin'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: transitions.create(['width', 'margin'], {
        easing: transitions.easing.sharp,
        duration: transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 36,
    },
    menuButtonHidden: {
      display: 'none',
    },
    title: {
      flexGrow: 1,
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
    search: {
      position: 'relative',
      borderRadius: shape.borderRadius,
      backgroundColor: fade(palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(palette.common.white, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [breakpoints.up('sm')]: {
        marginLeft: spacing.unit,
        width: 'auto',
      },
    },
    searchIcon: {
      width: spacing.unit * 9,
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
      width: '100%',
    },
    inputInput: {
      paddingTop: spacing.unit,
      paddingRight: spacing.unit,
      paddingBottom: spacing.unit,
      paddingLeft: spacing.unit * 10,
      transition: transitions.create('width'),
      width: '100%',
      [breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
    avatar: {},
    overflowX: {
      overflowX: 'auto',
    },
  });

interface ErrorTextProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
}
export const ErrorText = compose(withStyles(styles(DimeTheme)))(({ classes, children }: ErrorTextProps) => (
  <Typography color={'error'}>{children}</Typography>
));

export const LoadingSpinner = compose(withStyles(styles(DimeTheme)))(({ classes }: any) => (
  <CircularProgress className={classes.progress} />
));

interface DimeContentProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  loading?: boolean;
  paper?: boolean;
}

export const DimeContent = compose(withStyles(styles(DimeTheme)))(({ classes, children, loading, paper = true }: DimeContentProps) => {
  const content = loading ? <LoadingSpinner /> : children;
  return (
    <main className={classes.content}>
      <div className={classes.appBarSpacer} />
      {paper ? <DimePaper>{content}</DimePaper> : content}
    </main>
  );
});

interface DimePaperProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  overflowX?: boolean;
}

export const DimePaper = compose(withStyles(styles(DimeTheme)))(({ classes, children, overflowX = true }: DimePaperProps) => (
  <Paper className={classNames(classes.mainContent, overflowX && classes.overflowX)}>{children}</Paper>
));

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

            <Navigation handleDrawerOpen={this.handleDrawerOpen} drawerOpen={open} />
          </Drawer>

          {children}
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles(DimeTheme))(DimeLayout);

export const hasContent = (value: any) => {
  // tslint:disable-line:no-any
  if (!value) {
    return false;
  }
  if (value.length === 0) {
    return false;
  }
  return true;
};

interface LoadingProps {
  entity: any; // tslint:disable-line:no-any
  children: React.ReactNode;
  classes: any; // tslint:disable-line:no-any
}

export const Loading = compose(withStyles(styles(DimeTheme)))(({ entity, children, classes }: LoadingProps) => (
  <Fragment>{hasContent(entity) ? children : <CircularProgress className={classes.progress} />}</Fragment>
));
