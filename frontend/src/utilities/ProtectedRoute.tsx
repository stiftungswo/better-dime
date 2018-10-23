import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router';
import { MainStore } from '../store/mainStore';

interface ProtectedRouteProps extends RouteProps {
  mainStore?: MainStore;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>; // tslint:disable-line
}

@inject('mainStore')
@observer
export class ProtectedRoute extends React.Component<ProtectedRouteProps> {
  public protect = (props: RouteComponentProps) => {
    const login = {
      pathname: '/login',
      state: { referrer: props.location!.pathname },
    };
    const Component = this.props.component;
    return this.props.mainStore!.isLoggedIn ? <Component {...props} /> : <Redirect to={login} />;
  };

  public render() {
    return <Route {...this.props} component={undefined} render={this.protect} />;
  }
}
