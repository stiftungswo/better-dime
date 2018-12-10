import compose from '../utilities/compose';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import DimeTheme from './DimeTheme';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import classNames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Typography from '@material-ui/core/Typography/Typography';
import { Button, CircularProgress, withWidth } from '@material-ui/core';
import { MainStore } from '../stores/mainStore';
import { styles } from './DimeLayout';
import { ActionButton, ActionButtonAction, ButtonProps } from './ActionButton';
import { EmployeeStore } from '../stores/employeeStore';
import { DimeAppBarUserMenu } from './DimeAppBarUserMenu';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import { MenuIcon } from './icons';

//TODO should probably extract the respective styles from DimeLayout and declare them in this file
interface DimeAppBarProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  mainStore?: MainStore;
  employeeStore?: EmployeeStore;
  title: string;
  width?: Breakpoint;
}

@compose(
  withWidth(),
  inject('mainStore', 'employeeStore'),
  observer
)
class DimeAppBarInner extends React.Component<DimeAppBarProps> {
  constructor(props: DimeAppBarProps) {
    super(props);
    window.document.title = `${props.title} - Dime`;
  }

  handleMenu = (event: React.PointerEvent) => {
    this.props.mainStore!.userMenuAnchorEl = event.currentTarget as HTMLElement;
    this.props.mainStore!.userMenuOpen = false;
  };

  handleClose = () => {
    this.props.mainStore!.userMenuAnchorEl = null;
    this.props.mainStore!.userMenuOpen = false;
  };

  public render() {
    const { children, classes } = this.props;
    const { drawerOpen } = this.props.mainStore!;

    return (
      <AppBar position={'absolute'} className={classNames(classes.appBar, drawerOpen && this.props.width !== 'xs' && classes.appBarShift)}>
        <Toolbar disableGutters={!drawerOpen} className={classes.toolbar}>
          <IconButton
            color={'inherit'}
            aria-label={'Menü öffnen'}
            onClick={() => (this.props.mainStore!.drawerOpen = true)}
            className={classNames(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
          >
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

export const DimeAppBar = withStyles(styles(DimeTheme))(DimeAppBarInner);

export class DimeAppBarButton extends React.Component<ButtonProps> {
  public render = () => {
    return <ActionButton {...this.props} color={'inherit'} />;
  };
}
