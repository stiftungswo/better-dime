import * as React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import DimeLayout from './layout/DimeLayout';
import { ProtectedRoute } from './utilities/ProtectedRoute';
import CommentPresetOverview from './views/comment_presets/CommentPresetOverview';
import CompanyCreate from './views/companies/CompanyCreate';
import CompanyOverview from './views/companies/CompanyOverview';
import CompanyUpdate from './views/companies/CompanyUpdate';
import CostgroupOverview from './views/costgroups/CostgroupOverview';
import CustomerTagOverview from './views/customer_tags/CustomerTagOverview';
import { CustomerImportExportOverview } from './views/customers/CustomerImportExportOverview';
import EmployeeGroupOverview from './views/EmployeeGroupOverview';
import EmployeeCreateView from './views/employees/EmployeeCreate';
import EmployeeOverview from './views/employees/EmployeeOverview';
import EmployeeUpdateView from './views/employees/EmployeeUpdate';
import { GlobalSettingsUpdate } from './views/GlobalSettingsUpdate';
import HolidayOverview from './views/holidays/HolidayOverview';
import InvoiceCreate from './views/invoices/InvoiceCreate';
import InvoiceOverview from './views/invoices/InvoiceOverview';
import InvoiceUpdate from './views/invoices/InvoiceUpdate';
import LocationOverview from './views/locations/LocationOverview';
import Login from './views/Login';
import NotFound from './views/NotFound';
import OfferCreate from './views/offers/OfferCreate';
import OfferOverview from './views/offers/OfferOverview';
import OfferUpdate from './views/offers/OfferUpdate';
import PersonCreate from './views/persons/PersonCreate';
import PersonOverview from './views/persons/PersonOverview';
import PersonUpdate from './views/persons/PersonUpdate';
import ProjectCategoryOverview from './views/project_categories/ProjectCategoryOverview';
import ProjectCreate from './views/projects/ProjectCreate';
import ProjectOverview from './views/projects/ProjectOverview';
import ProjectUpdate from './views/projects/ProjectUpdate';
import ProjectWithPotentialInvoicesOverview from './views/projects/ProjectWithPotentialInvoicesOverview';
import RateGroupOverview from './views/rate_groups/RateGroupOverview';
import RateUnitOverview from './views/rate_units/RateUnitOverview';
import DailyReport from './views/reports/DailyReport';
import { EmployeesReport } from './views/reports/EmployeesReport';
import { PercentageReport } from './views/reports/PercentageReport';
import { ProjectReport } from './views/reports/ProjectReport';
import { RevenueReport } from './views/reports/RevenueReport';
import { ServiceCostReports } from './views/reports/ServiceCostReports';
import { ServiceHourReports } from './views/reports/ServiceHourReports';
import ServiceCreate from './views/services/ServiceCreate';
import ServiceOverview from './views/services/ServiceOverview';
import ServiceUpdate from './views/services/ServiceUpdate';
import Timetrack from './views/timetrack/Timetrack';

class App extends React.Component {
  render() {
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
            <ProtectedRoute exact path="/comment_presets/" component={CommentPresetOverview} />
            <ProtectedRoute exact requiresAdmin path="/rate_units" component={RateUnitOverview} />
            <ProtectedRoute exact requiresAdmin path="/employee_groups" component={EmployeeGroupOverview} />
            <ProtectedRoute exact path="/rate_groups" component={RateGroupOverview} />
            <ProtectedRoute exact path="/services" component={ServiceOverview} />
            <ProtectedRoute exact path="/services/new" component={ServiceCreate} />
            <ProtectedRoute exact path="/services/:id" component={ServiceUpdate} />
            <ProtectedRoute exact path="/cost_groups" component={CostgroupOverview} />
            <ProtectedRoute exact path="/project_categories" component={ProjectCategoryOverview} />
            <ProtectedRoute exact path="/customer_tags" component={CustomerTagOverview} />
            <ProtectedRoute exact path="/locations" component={LocationOverview} />
            <ProtectedRoute exact path="/timetrack" component={Timetrack} />
            <ProtectedRoute exact path="/persons" component={PersonOverview} />
            <ProtectedRoute exact path="/persons/new" component={PersonCreate} />
            <ProtectedRoute exact path="/persons/:id" component={PersonUpdate} />
            <ProtectedRoute exact path="/companies" component={CompanyOverview} />
            <ProtectedRoute exact path="/companies/new" component={CompanyCreate} />
            <ProtectedRoute exact path="/companies/:id" component={CompanyUpdate} />
            <ProtectedRoute exact path="/customers/transfer" component={CustomerImportExportOverview} />
            <ProtectedRoute exact path="/reports/daily" component={DailyReport} />
            <ProtectedRoute exact path="/reports/service-hours" component={ServiceHourReports} />
            <ProtectedRoute exact path="/reports/service-costs" component={ServiceCostReports} />
            <ProtectedRoute exact path="/reports/revenue" component={RevenueReport} />
            <ProtectedRoute exact path="/reports/employees" component={EmployeesReport} />
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
