import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { ServiceStore } from '../../stores/serviceStore';
import { RateGroup, Service } from '../../types';
import { FormValues } from '../../types';
import compose from '../../utilities/compose';
import { empty } from '../../utilities/helpers';
import ServiceForm from './ServiceForm';
import { serviceTemplate } from './serviceSchema';

export interface Props extends RouteComponentProps {
  serviceStore?: ServiceStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('serviceStore', 'rateGroupStore'),
  observer,
)
export default class ServiceCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  handleSubmit = (service: Service) => {
    return this.props.serviceStore!.post(service).then(() => {
      this.setState({ submitted: true });
      const idOfNewService = this.props!.serviceStore!.service!.id;
      this.props.history.replace('/services/' + idOfNewService);
    });
  }

  @computed
  get serviceRates() {
    return this.props.rateGroupStore!.rateGroups.map((g: RateGroup) => ({
      rate_group_id: g.id,
      rate_unit_id: null,
      value: null,
    }));
  }

  @computed
  get service() {
    // We prepopulate the form with all registered ServiceRates from the backend, to ensure all of them have been
    // connected with this service. This does not handle the case where a new ServiceRate is created later, but
    // we don't intend to create any in the future, so we just ignore that case.
    return {
      ...serviceTemplate,
      service_rates: this.serviceRates as FormValues,
    };
  }

  render() {
    return (
      <ServiceForm
        title={'Service erstellen'}
        onSubmit={this.handleSubmit}
        // tslint:disable-next-line:no-any ; at some point we need to address the disparity between template and domain types
        service={this.service as any}
        loading={empty(this.serviceRates)}
        submitted={this.state.submitted}
        rateUnitSelectDisabled={false}
      />
    );
  }
}
