import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { ServiceStore } from '../../stores/serviceStore';
import { Service } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import ServiceForm from './ServiceForm';

interface ServiceDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<ServiceDetailRouterProps> {
  serviceStore?: ServiceStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('offerStore', 'serviceStore'),
  observer,
)
export default class ServiceUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.serviceStore!.fetchOne(Number(props.match.params.id));
  }

  handleSubmit = (service: Service) => this.props.serviceStore!.put(service);

  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.service.update');
    const serviceStore = this.props.serviceStore!;
    const service: Service | undefined = serviceStore.service ? toJS(serviceStore.service) : undefined;
    const title = service ? `${service.name} - ` + intlText('general.service.plural', true) : intlText('edit_service');

    return <ServiceForm rateUnitSelectDisabled title={title} onSubmit={this.handleSubmit} service={service} />;
  }
}
