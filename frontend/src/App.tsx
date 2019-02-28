import * as React from 'react';

import OfferOverview from './views/offers/OfferOverview';
import { Redirect, Route, Switch } from 'react-router-dom';
import Login from './views/Login';
import DimeLayout from './layout/DimeLayout';
import EmployeeOverview from './views/employees/EmployeeOverview';
import EmployeeUpdateView from './views/employees/EmployeeUpdate';
import EmployeeCreateView from './views/employees/EmployeeCreate';
import { ProtectedRoute } from './utilities/ProtectedRoute';
import HolidayOverview from './views/holidays/HolidayOverview';
import ServiceOverview from './views/services/ServiceOverview';
import ServiceUpdate from './views/services/ServiceUpdate';
import ServiceCreate from './views/services/ServiceCreate';
import OfferCreate from './views/offers/OfferCreate';
import OfferUpdate from './views/offers/OfferUpdate';
import RateUnitOverview from './views/rate_units/RateUnitOverview';
import RateGroupOverview from './views/rate_groups/RateGroupOverview';
import ProjectCategoryOverview from './views/project_categories/ProjectCategoryOverview';
import CustomerTagOverview from './views/customer_tags/CustomerTagOverview';
import ProjectOverview from './views/projects/ProjectOverview';
import ProjectUpdate from './views/projects/ProjectUpdate';
import ProjectCreate from './views/projects/ProjectCreate';
import InvoiceOverview from './views/invoices/InvoiceOverview';
import InvoiceUpdate from './views/invoices/InvoiceUpdate';
import InvoiceCreate from './views/invoices/InvoiceCreate';
import Timetrack from './views/timetrack/Timetrack';
import PersonOverview from './views/persons/PersonOverview';
import PersonCreate from './views/persons/PersonCreate';
import PersonUpdate from './views/persons/PersonUpdate';
import CompanyOverview from './views/companies/CompanyOverview';
import CompanyUpdate from './views/companies/CompanyUpdate';
import CompanyCreate from './views/companies/CompanyCreate';
import { CustomerImportExportOverview } from './views/customers/CustomerImportExportOverview';
import DailyReport from './views/reports/DailyReport';
import NotFound from './views/NotFound';
import { ServiceReports } from './views/reports/ServiceReports';
import { RevenueReport } from './views/reports/RevenueReport';
import { GlobalSettingsUpdate } from './views/GlobalSettingsUpdate';
import { ProjectReport } from './views/reports/ProjectReport';
import EmployeeGroupOverview from './views/EmployeeGroupOverview';
import ProjectWithPotentialInvoicesOverview from './views/projects/ProjectWithPotentialInvoicesOverview';
import { PercentageReport } from './views/reports/PercentageReport';

class App extends React.Component {
  public render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <DimeLayout>
          <Switch>
            <Route exact path="/">
              <Redirect to={'/timetrack'} />
            </Route>
            <ProtectedRoute exact path="/offers" component={OfferOverview} />
            <ProtectedRoute exact path="/offers/new" component={OfferCreate} />
            <ProtectedRoute exact path="/offers/:id" component={OfferUpdate} />
            <ProtectedRoute exact path="/projects" component={ProjectOverview} />
            <ProtectedRoute exact path="/projects/potential_invoices" component={ProjectWithPotentialInvoicesOverview} />
            <ProtectedRoute exact path="/projects/new" component={ProjectCreate} />
            <ProtectedRoute exact path="/projects/:id" component={ProjectUpdate} />
            <ProtectedRoute exact path="/invoices" component={InvoiceOverview} />
            <ProtectedRoute exact path="/invoices/new" component={InvoiceCreate} />
            <ProtectedRoute exact path="/invoices/:id" component={InvoiceUpdate} />
            <ProtectedRoute exact path="/employees" component={EmployeeOverview} />
            <ProtectedRoute exact path="/employees/new" component={EmployeeCreateView} />
            <ProtectedRoute exact path="/employees/:id" component={EmployeeUpdateView} />
            <ProtectedRoute exact path="/holidays" component={HolidayOverview} />
            <ProtectedRoute exact requiresAdmin path="/rate_units" component={RateUnitOverview} />
            <ProtectedRoute exact requiresAdmin path="/employee_groups" component={EmployeeGroupOverview} />
            <ProtectedRoute exact path="/rate_groups" component={RateGroupOverview} />
            <ProtectedRoute exact path="/services" component={ServiceOverview} />
            <ProtectedRoute exact path="/services/new" component={ServiceCreate} />
            <ProtectedRoute exact path="/services/:id" component={ServiceUpdate} />
            <ProtectedRoute exact path="/project_categories" component={ProjectCategoryOverview} />
            <ProtectedRoute exact path="/customer_tags" component={CustomerTagOverview} />
            <ProtectedRoute exact path="/timetrack" component={Timetrack} />
            <ProtectedRoute exact path="/persons" component={PersonOverview} />
            <ProtectedRoute exact path="/persons/new" component={PersonCreate} />
            <ProtectedRoute exact path="/persons/:id" component={PersonUpdate} />
            <ProtectedRoute exact path="/companies" component={CompanyOverview} />
            <ProtectedRoute exact path="/companies/new" component={CompanyCreate} />
            <ProtectedRoute exact path="/companies/:id" component={CompanyUpdate} />
            <ProtectedRoute exact path="/customers/transfer" component={CustomerImportExportOverview} />
            <ProtectedRoute exact path="/reports/daily" component={DailyReport} />
            <ProtectedRoute exact path="/reports/service" component={ServiceReports} />
            <ProtectedRoute exact path="/reports/revenue" component={RevenueReport} />
            <ProtectedRoute exact path="/reports/project" component={ProjectReport} />
            <ProtectedRoute exact requiresAdmin path="/global_settings" component={GlobalSettingsUpdate} />
            <ProtectedRoute exact path="/reports/costgroup" component={PercentageReport} />
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </DimeLayout>
      </Switch>
    );
  }
}

export default App;
