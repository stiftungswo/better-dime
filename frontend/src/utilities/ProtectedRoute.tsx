import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router';
import compose from './compose';
import { ApiStore } from '../stores/apiStore';

interface ProtectedRouteProps extends RouteProps {
  apiStore?: ApiStore;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>; // tslint:disable-line
}

@compose(
  inject('apiStore'),
  observer
)
export class ProtectedRoute extends React.Component<ProtectedRouteProps> {
  public protect = (props: RouteComponentProps) => {
    const login = {
      pathname: '/login',
      state: { referrer: props.location!.pathname },
    };
    const Component = this.props.component;
    return this.props.apiStore!.isLoggedIn ? <Component {...props} /> : <Redirect to={login} />;
  };

  public render() {
    return <Route {...this.props} component={undefined} render={this.protect} />;
  }
}
