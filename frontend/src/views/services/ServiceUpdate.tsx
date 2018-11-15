import * as React from 'react';
import { observer } from 'mobx-react';
import { ServiceStore } from '../../stores/serviceStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import ServiceForm from './ServiceForm';
import { Service } from './types';
import { inject } from 'mobx-react';
import compose from '../../utilities/compose';

interface ServiceDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<ServiceDetailRouterProps>, InjectedNotistackProps {
  serviceStore?: ServiceStore;
}

@compose(
  inject('offerStore', 'serviceStore'),
  observer
)
export default class ServiceUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.serviceStore!.fetchOne(Number(props.match.params.id));
  }

  public handleSubmit = (service: Service) => this.props.serviceStore!.put(service);

  public render() {
    const service: Service | undefined = this.props.serviceStore!.service;
    const title = service ? `${service.name} - Services` : 'Service bearbeiten';

    return <ServiceForm title={title} onSubmit={this.handleSubmit} service={service} />;
  }
}
