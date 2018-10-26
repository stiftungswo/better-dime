import compose from '../utilities/compose';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import DimeTheme from './DimeTheme';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import AppBar from '@material-ui/core/AppBar/AppBar';
import classNames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography/Typography';
import { Button, CircularProgress } from '@material-ui/core';
import { MainStore } from '../stores/mainStore';
import { styles } from './DimeLayout';
import { ActionButton, ActionButtonAction } from './ActionButton';

//TODO should probably extract the respective styles from DimeLayout and declare them in this file
interface DimeAppBarProps extends WithStyles<typeof styles> {
  children?: React.ReactNode;
  mainStore?: MainStore;
  title: string;
}

@compose(
  inject('mainStore'),
  observer
)
class DimeAppBar_ extends React.Component<DimeAppBarProps> {
  constructor(props: DimeAppBarProps) {
    super(props);
    window.document.title = `${props.title} - Dime`;
  }

  public render() {
    const { children, classes } = this.props;
    const open = this.props.mainStore!.drawerOpen;

    return (
      <AppBar position={'absolute'} className={classNames(classes.appBar, open && classes.appBarShift)}>
        <Toolbar disableGutters={!open} className={classes.toolbar}>
          <IconButton
            color={'inherit'}
            aria-label={'Menü öffnen'}
            onClick={() => (this.props.mainStore!.drawerOpen = true)}
            className={classNames(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>

          <Typography component={'h1'} variant={'h6'} color={'inherit'} noWrap={true} className={classes.title} align={'left'}>
            {this.props.title}
          </Typography>

          {this.props.mainStore!.loading && (
            <Button>
              <CircularProgress className={classes.progress} size={16} />
            </Button>
          )}

          {children}
        </Toolbar>
      </AppBar>
    );
  }
}

export const DimeAppBar = withStyles(styles(DimeTheme))(DimeAppBar_);

interface ButtonProps {
  icon: any;
  title: string;
  action?: ActionButtonAction;
  disabled?: boolean;
}

export class DimeAppBarButton extends React.Component<ButtonProps> {
  public render = () => {
    return <ActionButton {...this.props} color={'inherit'} />;
  };
}
