import * as React from 'react';

import { NavItem } from './NavItem';
import { Collapsible } from './Collapsible';
import {
  CompanyIcon,
  CustomersIcon,
  HolidayIcon,
  ImportExportIcon,
  InvoiceIcon,
  MasterDataIcon,
  OfferIcon,
  PeopleIcon,
  PersonIcon,
  ProjectCategoryIcon,
  ProjectIcon,
  RateGroupIcon,
  RateUnitIcon,
  ReportIcon,
  ServiceIcon,
  TagsIcon,
  TimetrackIcon,
} from './icons';

interface NavigationProps {
  handleDrawerOpen: () => void;
  drawerOpen: boolean;
}

export const Navigation = ({ handleDrawerOpen, drawerOpen }: NavigationProps) => (
  <React.Fragment>
    <NavItem to={'/timetrack'} exact label={'Zeiterfassung'} icon={TimetrackIcon} />
    <NavItem to={'/offers'} exact label={'Offerten'} icon={OfferIcon} />
    <NavItem to={'/projects'} exact label={'Projekte'} icon={ProjectIcon} />
    <NavItem to={'/invoices'} label={'Rechnungen'} icon={InvoiceIcon} />
    <NavItem to={'/employees'} label={'Mitarbeiter'} icon={PeopleIcon} />
    <Collapsible icon={CustomersIcon} label={'Kunden'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/persons'} label={'Personen'} icon={PersonIcon} />
      <NavItem nested to={'/companies'} label={'Firmen'} icon={CompanyIcon} />
      <NavItem nested to={'/customers/transfer'} label={'Import / Export'} icon={ImportExportIcon} />
    </Collapsible>
    <Collapsible icon={ReportIcon} label={'Rapporte'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/reports/daily'} label={'Wochenrapport'} />
    </Collapsible>
    <Collapsible icon={MasterDataIcon} label={'Stammdaten'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/services'} label={'Services'} icon={ServiceIcon} />
      <NavItem nested to={'/rate_groups'} label={'Tarif-Gruppen'} icon={RateGroupIcon} />
      <NavItem nested to={'/rate_units'} label={'Tarif-Typen'} icon={RateUnitIcon} />
      <NavItem nested to={'/holidays'} label={'Feiertage'} icon={HolidayIcon} />
      <NavItem nested to={'/project_categories'} label={'Tätigkeitsbereiche'} icon={ProjectCategoryIcon} />
      <NavItem nested to={'customer_tags'} label={'Tags'} icon={TagsIcon} />
    </Collapsible>
  </React.Fragment>
);
