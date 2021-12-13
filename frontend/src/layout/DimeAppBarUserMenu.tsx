import { Avatar, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { MainStore } from 'src/stores/mainStore';
import { ApiStore } from '../stores/apiStore';
import compose from '../utilities/compose';
import { AccountIcon, LogoutIcon } from './icons';

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
      const { first_name, last_name } = meDetail!;
      shortName = `${first_name.slice(0, 1)}${last_name.slice(0, 1)}`;
      fullName = `${first_name} ${last_name}`;
    }

    const open = this.props.mainStore!.userMenuOpen;
    const { userMenuAnchorEl } = this.props.mainStore!;

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
              <AccountIcon />
            </ListItemIcon>
            <ListItemText primary={fullName} />
          </MenuItem>
          <MenuItem onClick={this.handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Abmelden" />
          </MenuItem>
        </Menu>
      </div>
    );
  }

  private handleMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.props.mainStore!.userMenuAnchorEl = event.currentTarget;
    this.props.mainStore!.userMenuOpen = true;
  }

  private handleClose = () => {
    this.props.mainStore!.userMenuAnchorEl = null;
    this.props.mainStore!.userMenuOpen = false;
  }

  private handleProfile = () => {
    const myId = this.props.mainStore!.userId;
    this.props.mainStore!.userMenuAnchorEl = null;
    this.props.mainStore!.userMenuOpen = false;

    this.props.mainStore!.navigateTo(`/employees/${myId}`);
  }

  private handleLogout = () => {
    this.props.mainStore!.userMenuAnchorEl = null;
    this.props.mainStore!.userMenuOpen = false;

    this.props.apiStore!.logout();
  }
}
