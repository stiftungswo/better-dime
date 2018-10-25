import * as React from 'react';
import './App.css';

import OfferOverview from './overview/OfferOverview';

import { createBrowserHistory } from 'history';
import { Route, Router, Switch } from 'react-router-dom';
import OfferDetailView from './overview/OfferDetailView';
import Login from './employees/Login';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import DimeTheme from './utilities/DimeTheme';
import DimeLayout from './utilities/DimeLayout';
import EmployeeOverview from './employees/EmployeeOverview';
import EmployeeUpdateView from './employees/EmployeeUpdateView';
import EmployeeCreateView from './employees/EmployeeCreateView';
import { ProtectedRoute } from './utilities/ProtectedRoute';
import { StoreProvider } from './utilities/StoreProvider';
import HolidayOverview from './holidays/HolidayOverview';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';

const browserHistory = createBrowserHistory();

class App extends React.Component {
  public render() {
    return (
      <StoreProvider history={browserHistory}>
        <MuiThemeProvider theme={DimeTheme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Router history={browserHistory}>
              <div className="App">
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
                      <Route>
                        <p>404</p>
                      </Route>
                    </Switch>
                  </DimeLayout>
                </Switch>
              </div>
            </Router>
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </StoreProvider>
    );
  }
}

export default App;
