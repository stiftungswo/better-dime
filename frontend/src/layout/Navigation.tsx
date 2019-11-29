import * as React from 'react';

import { Collapsible } from './Collapsible';
import {
  AddCommentIcon,
  CompanyIcon,
  CustomersIcon,
  EmployeeIcon,
  HolidayIcon,
  ImportExportIcon,
  InvoiceIcon,
  MasterDataIcon,
  OfferIcon,
  PersonIcon,
  ProjectCategoryIcon,
  ProjectIcon,
  RateGroupIcon,
  RateUnitIcon,
  ReportIcon,
  ServiceIcon,
  SettingsIcon,
  TagsIcon,
  TimetrackIcon,
} from './icons';
import { NavItem } from './NavItem';

interface NavigationProps {
  drawerOpen: boolean;
  handleDrawerOpen: () => void;
  isAdmin: boolean;
}

export const Navigation = ({ drawerOpen, handleDrawerOpen, isAdmin }: NavigationProps) => (
  <>
    <NavItem to={'/timetrack'} exact label={'Zeiterfassung'} icon={TimetrackIcon} />
    <NavItem to={'/offers'} exact label={'Offerten'} icon={OfferIcon} />
    <Collapsible icon={ProjectIcon} label={'Projekte'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/projects'} exact label={'Alle'} icon={ProjectIcon} />
      <NavItem nested to={'/projects/potential_invoices'} exact label={'Nicht verrechnet'} icon={InvoiceIcon} />
    </Collapsible>
    <NavItem to={'/invoices'} label={'Rechnungen'} icon={InvoiceIcon} />
    <NavItem to={'/employees'} label={'Mitarbeiter'} icon={EmployeeIcon} />
    <Collapsible icon={CustomersIcon} label={'Kunden'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/persons'} label={'Personen'} icon={PersonIcon} />
      <NavItem nested to={'/companies'} label={'Firmen'} icon={CompanyIcon} />
      <NavItem nested to={'/customer_tags'} label={'Tags'} icon={TagsIcon} />
      <NavItem nested to={'/customers/transfer'} label={'Import / Export'} icon={ImportExportIcon} />
    </Collapsible>
    <Collapsible icon={ReportIcon} label={'Rapporte'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/reports/daily'} label={'Wochenrapport'} />
      <NavItem nested to={'/reports/service'} label={'Service-Rapporte'} />
      <NavItem nested to={'/reports/revenue'} label={'Umsatzrapport'} />
      <NavItem nested to={'/reports/project'} label={'Projektrapport'} />
      <NavItem nested to={'/reports/costgroup'} label={'Kostenstellenraport'} />
    </Collapsible>
    <Collapsible icon={MasterDataIcon} label={'Stammdaten'} handleDrawerOpen={handleDrawerOpen} drawerOpen={drawerOpen}>
      <NavItem nested to={'/services'} label={'Services'} icon={ServiceIcon} />
      <NavItem nested to={'/rate_groups'} label={'Tarif-Gruppen'} icon={RateGroupIcon} />
      {isAdmin && <NavItem nested to={'/rate_units'} label={'Tarif-Typen'} icon={RateUnitIcon} />}
      {isAdmin && <NavItem nested to={'/employee_groups'} label={'Mitarbeiter-Gruppen'} icon={EmployeeIcon} />}
      {isAdmin && <NavItem nested to={'/comment_presets'} label={'Kommentarvorschläge'} icon={AddCommentIcon} />}
      <NavItem nested to={'/holidays'} label={'Feiertage'} icon={HolidayIcon} />
      <NavItem nested to={'/project_categories'} label={'Tätigkeitsbereiche'} icon={ProjectCategoryIcon} />
      {isAdmin && <NavItem nested to={'/global_settings'} label={'Einstellungen'} icon={SettingsIcon} />}
    </Collapsible>
  </>
);
