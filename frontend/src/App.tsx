import * as React from 'react';

import OfferOverview from './views/offers/OfferOverview';
import { Route, Switch } from 'react-router-dom';
import OfferDetailView from './views/offers/OfferDetailView';
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
import RateUnitOverview from './views/rate_units/RateUnitOverview';

class App extends React.Component {
  public render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <DimeLayout>
          <Switch>
            <ProtectedRoute exact path="/" component={OfferOverview} />
            <ProtectedRoute exact path="/offer/:id" component={OfferDetailView} />
            <ProtectedRoute exact path="/employees" component={EmployeeOverview} />
            <ProtectedRoute exact path="/employees/new" component={EmployeeCreateView} />
            <ProtectedRoute exact path="/employees/:id" component={EmployeeUpdateView} />
            <ProtectedRoute exact path="/holidays" component={HolidayOverview} />
            <ProtectedRoute exact path="/rate_units" component={RateUnitOverview} />
            <ProtectedRoute exact path="/services" component={ServiceOverview} />
            <ProtectedRoute exact path="/services/new" component={ServiceCreate} />
            <ProtectedRoute exact path="/services/:id" component={ServiceUpdate} />
            <Route>
              <p>404</p>
            </Route>
          </Switch>
        </DimeLayout>
      </Switch>
    );
  }
}

export default App;
