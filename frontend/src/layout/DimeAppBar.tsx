import { Theme, withWidth } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import { createStyles, withStyles, WithStyles } from '@mui/material/styles';
import { Breakpoint } from '@mui/material/styles/createBreakpoints';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EmployeeStore } from '../stores/employeeStore';
import { MainStore } from '../stores/mainStore';
import compose from '../utilities/compose';
import { ActionButton, ButtonProps } from './ActionButton';
import { DimeAppBarUserMenu } from './DimeAppBarUserMenu';
import { drawerWidth } from './DimeLayout';
import { MenuIcon } from './icons';

export const styles = ({ palette, spacing, breakpoints, mixins, transitions, zIndex }: Theme) =>
  createStyles({
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
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
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
  });

interface Props extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  mainStore?: MainStore;
  employeeStore?: EmployeeStore;
  title: string;
  width?: Breakpoint;
  alternativeColor?: boolean;
}

@compose(
  withWidth(),
  inject('mainStore', 'employeeStore'),
  observer,
)
class DimeAppBarInner extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    window.document.title = `${props.title} - Dime`;
  }

  handleMenu = (event: React.PointerEvent) => {
    this.props.mainStore!.userMenuAnchorEl = event.currentTarget as HTMLElement;
    this.props.mainStore!.userMenuOpen = false;
  }

  handleClose = () => {
    this.props.mainStore!.userMenuAnchorEl = null;
    this.props.mainStore!.userMenuOpen = false;
  }

  render() {
    const { children, classes, alternativeColor } = this.props;
    const { drawerOpen } = this.props.mainStore!;

    return (
      <AppBar
        position={'fixed'}
        className={classNames(classes.appBar, drawerOpen && this.props.width !== 'xs' && classes.appBarShift)}
        color={alternativeColor ? 'secondary' : 'primary'}
      >
        <Toolbar disableGutters={!drawerOpen} className={classes.toolbar}>
          <IconButton
            color={'inherit'}
            aria-label={'Menü öffnen'}
            onClick={() => (this.props.mainStore!.drawerOpen = true)}
            className={classNames(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
            size="large">
            <MenuIcon />
          </IconButton>

          <Typography component={'h1'} variant={'h6'} color={'inherit'} noWrap={true} className={classes.title} align={'left'}>
            {this.props.title}
          </Typography>

          {children}
          <DimeAppBarUserMenu />
        </Toolbar>
      </AppBar>
    );
  }
}

export const DimeAppBar = withStyles(styles)(DimeAppBarInner);

export const DimeAppBarButton = (props: ButtonProps) => {
  return <ActionButton {...props} color={'inherit'} />;
};
