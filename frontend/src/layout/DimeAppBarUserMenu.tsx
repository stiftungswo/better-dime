import {IconButton, ListItemText} from '@material-ui/core';
import {Avatar, ListItemIcon, Menu, MenuItem} from '@material-ui/core/es';
import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {ApiStore} from '../stores/apiStore';
import {MainStore, messages} from '../stores/mainStore';
import {Locale} from '../types';
import compose from '../utilities/compose';
import {AccountIcon, LogoutIcon} from './icons';

interface DimeAppBarUserMenuProps {
  mainStore?: MainStore;
  apiStore?: ApiStore;
}

@compose(
  inject('mainStore', 'apiStore'),
  observer,
)
export class DimeAppBarUserMenu extends React.Component<DimeAppBarUserMenuProps> {
  constructor(props: DimeAppBarUserMenuProps) {
    super(props);
  }

  render() {
    const meDetail = this.props.apiStore!.meDetail;
    let shortName = '?';
    let fullName = '?';

    if (meDetail) {
      const {first_name, last_name} = meDetail!;
      shortName = `${first_name.slice(0, 1)}${last_name.slice(0, 1)}`;
      fullName = `${first_name} ${last_name}`;
    }

    const mainStore = this.props.mainStore!;
    const open = mainStore.userMenuOpen;
    const {userMenuAnchorEl} = mainStore;

    return (
      <div>
        <IconButton aria-owns={open ? 'menu-appbar' : undefined} aria-haspopup="true" onClick={this.handleMenu} color="inherit">
          <Avatar>{shortName}</Avatar>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={userMenuAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleProfile}>
            <ListItemIcon>
              <AccountIcon/>
            </ListItemIcon>
            <ListItemText inset primary={fullName}/>
          </MenuItem>
          <MenuItem onClick={this.handleLogout}>
            <ListItemIcon>
              <LogoutIcon/>
            </ListItemIcon>
            <ListItemText inset primary="Abmelden"/>
          </MenuItem>
          {Object.keys(messages).map(locale => (
            <MenuItem key={locale} onClick={() => this.handleLocaleSelect(locale as Locale)}>
              <ListItemText inset primary={locale}/>
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }

  private handleLocaleSelect = (locale: Locale) => {
    this.props.mainStore!.locale = locale;
    this.props.mainStore!.userMenuOpen = false;

  };

  private handleMenu = (event: React.MouseEvent<HTMLInputElement>) => {
    this.props.mainStore!.userMenuAnchorEl = event.currentTarget;
    this.props.mainStore!.userMenuOpen = true;
  };

  private handleClose = () => {
    this.props.mainStore!.userMenuAnchorEl = null;
    this.props.mainStore!.userMenuOpen = false;
  };

  private handleProfile = () => {
    const myId = this.props.mainStore!.userId;
    this.props.mainStore!.userMenuAnchorEl = null;
    this.props.mainStore!.userMenuOpen = false;

    this.props.mainStore!.navigateTo(`/employees/${myId}`);
  };

  private handleLogout = () => {
    this.props.mainStore!.userMenuAnchorEl = null;
    this.props.mainStore!.userMenuOpen = false;

    this.props.apiStore!.logout();
  };
}
