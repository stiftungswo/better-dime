import { Theme, withWidth } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar/AppBar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { EmployeeStore } from '../stores/employeeStore';
import { MainStore } from '../stores/mainStore';
import compose from '../utilities/compose';
import { ActionButton, ButtonProps } from './ActionButton';
import { DimeAppBarUserMenu } from './DimeAppBarUserMenu';
import { drawerWidth, styles } from './DimeLayout';
import { MenuIcon } from './icons';

interface Props extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  mainStore?: MainStore;
  employeeStore?: EmployeeStore;
  title: string;
  width?: Breakpoint;
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
    const { children, classes } = this.props;
    const { drawerOpen } = this.props.mainStore!;

    return (
      <AppBar position={'fixed'} className={classNames(classes.appBar, drawerOpen && this.props.width !== 'xs' && classes.appBarShift)}>
        <Toolbar disableGutters={!drawerOpen}>
          <IconButton
            color={'inherit'}
            aria-label={'Menü öffnen'}
            onClick={() => (this.props.mainStore!.drawerOpen = true)}
            className={classNames(classes.menuButton, drawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant={'h6'} noWrap className={classes.title}>
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
