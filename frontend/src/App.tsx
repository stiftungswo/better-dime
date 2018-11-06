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

class App extends React.Component {
  public render() {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <DimeLayout>
          <Switch>
            <Route exact path="/">
              <Redirect to={'/offers'} />
            </Route>
            <ProtectedRoute exact path="/offers" component={OfferOverview} />
            <ProtectedRoute exact path="/offers/new" component={OfferCreate} />
            <ProtectedRoute exact path="/offers/:id" component={OfferUpdate} />
            <ProtectedRoute exact path="/employees" component={EmployeeOverview} />
            <ProtectedRoute exact path="/employees/new" component={EmployeeCreateView} />
            <ProtectedRoute exact path="/employees/:id" component={EmployeeUpdateView} />
            <ProtectedRoute exact path="/holidays" component={HolidayOverview} />
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
