import { Avatar, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { frenchLocale, germanLocale, MainStore } from 'src/stores/mainStore';
import { ApiStore } from '../stores/apiStore';
import compose from '../utilities/compose';
import { AccountIcon, LanguageIcon, LogoutIcon } from './icons';

interface DimeAppBarUserMenuProps {
  mainStore?: MainStore;
  apiStore?: ApiStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'apiStore'),
  observer,
)
export class DimeAppBarUserMenu extends React.Component<DimeAppBarUserMenuProps> {
  constructor(props: DimeAppBarUserMenuProps) {
    super(props);
  }

  render() {
    const { apiStore, mainStore, intl } = this.props;
    const meDetail = apiStore!.meDetail;
    let shortName = '?';
    let fullName = '?';

    if (meDetail) {
      const { first_name, last_name } = meDetail!;
      shortName = `${first_name.slice(0, 1)}${last_name.slice(0, 1)}`;
      fullName = `${first_name} ${last_name}`;
    }

    const open = mainStore!.userMenuOpen;
    const { userMenuAnchorEl } = mainStore!;

    const languageName = intl!.formatMessage({id: 'language.display_name'});

    return (
      <div>
        <IconButton
          aria-owns={open ? 'menu-appbar' : undefined}
          aria-haspopup="true"
          onClick={action(this.handleMenu)}
          color="inherit"
          size="large"
        >
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
          onClose={action(this.handleClose)}
        >
          <MenuItem onClick={action(this.handleProfile)}>
            <ListItemIcon>
              <AccountIcon />
            </ListItemIcon>
            <ListItemText primary={fullName} />
          </MenuItem>
          <MenuItem onClick={action(this.changeLanguage)}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary={languageName} />
          </MenuItem>
          <MenuItem onClick={action(this.handleLogout)}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={intl!.formatMessage({id: 'general.action.logout'})} />
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

  private changeLanguage = () => {
    const { intl } = this.props;
    const newLocale = intl!.locale === germanLocale ? frenchLocale : germanLocale;
    this.props.mainStore!.currentLocale = newLocale;
  }
}
