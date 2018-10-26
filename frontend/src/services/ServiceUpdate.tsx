import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { ServiceStore } from '../store/serviceStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps, withSnackbar } from 'notistack';
import ServiceForm from './ServiceForm';
import compose from '../compose';
import { Service } from './types';

interface ServiceDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<ServiceDetailRouterProps>, InjectedNotistackProps {
  serviceStore?: ServiceStore;
}

@inject('serviceStore')
@observer
class ServiceUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.serviceStore!.fetchOne(Number(props.match.params.id));
  }

  public handleSubmit = (service: Service) => {
    return this.props.serviceStore!.put(service);
  };

  public render() {
    const service: Service | undefined = this.props!.serviceStore!.service;

    return <ServiceForm handleSubmit={this.handleSubmit} service={service} />;
  }
}

export default compose(withSnackbar(ServiceUpdate));
