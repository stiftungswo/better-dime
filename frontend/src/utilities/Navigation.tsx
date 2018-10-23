import * as React from 'react';

import PeopleIcon from '@material-ui/icons/People';
import DriveFile from '@material-ui/icons/InsertDriveFile';
import ListIcon from '@material-ui/icons/List';
import EuroSymbol from '@material-ui/icons/EuroSymbol';
import { NavItem } from './NavItem';
import { Collapsible } from './Collapsible';

interface NavigationProps {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
}

export const Navigation = ({ handleDrawerOpen, drawerOpen }: NavigationProps) => (
  <React.Fragment>
    <NavItem to={'/'} exact label={'Offerten'} icon={DriveFile} />
    <NavItem to={'/employees'} label={'Mitarbeiter'} icon={PeopleIcon} />
    <Collapsible icon={ListIcon} label={'Stammdaten'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/services'} label={'Services'} />
      <NavItem nested to={'/service_rates'} label={'Tarif-Einheiten'} icon={EuroSymbol} />
    </Collapsible>
  </React.Fragment>
);
