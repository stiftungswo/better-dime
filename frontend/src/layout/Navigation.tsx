import * as React from 'react';

import PeopleIcon from '@material-ui/icons/People';
import DriveFile from '@material-ui/icons/InsertDriveFile';
import CreditCard from '@material-ui/icons/CreditCard';
import ListIcon from '@material-ui/icons/List';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { NavItem } from './NavItem';
//TODO proxy icon imports from a material through a single file and make sure the root is never imported
import { AttachMoney, Domain, RoomService, Work, Weekend, Storage } from '@material-ui/icons/';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { Collapsible } from './Collapsible';

interface NavigationProps {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
}

export const Navigation = ({ handleDrawerOpen, drawerOpen }: NavigationProps) => (
  <React.Fragment>
    <NavItem to={'/timetrack'} exact label={'Zeiterfassung'} icon={AccessTimeIcon} />
    <NavItem to={'/offers'} exact label={'Offerten'} icon={DriveFile} />
    <NavItem to={'/projects'} exact label={'Projekte'} icon={AssignmentIcon} />
    <NavItem to={'/invoices'} label={'Rechnungen'} icon={CreditCard} />
    <NavItem to={'/employees'} label={'Mitarbeiter'} icon={PeopleIcon} />
    <Collapsible icon={Storage} label={'Stammdaten'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/services'} label={'Services'} icon={RoomService} />
      <NavItem nested to={'/rate_groups'} label={'Tarif-Gruppen'} icon={Domain} />
      <NavItem nested to={'/rate_units'} label={'Tarif-Typen'} icon={AttachMoney} />
      <NavItem nested to={'/holidays'} label={'Feiertage'} icon={Weekend} />
      <NavItem nested to={'/project_categories'} label={'Tätigkeitsbereiche'} icon={Work} />
      <NavItem nested to={'customer_tags'} label={'Tags'} />
    </Collapsible>
  </React.Fragment>
);
