import * as React from 'react';
import { observer } from 'mobx-react';
import { ServiceStore } from '../../stores/serviceStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import ServiceForm from './ServiceForm';
import { Service } from '../../types';
import { inject } from 'mobx-react';
import compose from '../../utilities/compose';
import { toJS } from 'mobx';

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
    const serviceStore = this.props.serviceStore!;
    const service: Service | undefined = serviceStore.service ? toJS(serviceStore.service) : undefined;
    const title = service ? `${service.name} - Services` : 'Service bearbeiten';

    return <ServiceForm rateUnitSelectDisabled title={title} onSubmit={this.handleSubmit} service={service} />;
  }
}
