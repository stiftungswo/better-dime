import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { ServiceStore } from '../../stores/serviceStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import ServiceForm from './ServiceForm';
import compose from '../../utilities/compose';
import { Service } from './types';
import { RateGroup, RateGroupStore } from '../../stores/rateGroupStore';
import { computed } from 'mobx';
import { hasContent } from '../../layout/DimeLayout';

export interface Props extends RouteComponentProps, InjectedNotistackProps {
  serviceStore?: ServiceStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('offerStore', 'rateGroupStore'),
  observer
)
export default class ServiceCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  constructor(props: Props) {
    super(props);
    props.rateGroupStore!.fetchAll();
  }

  public handleSubmit = (service: Service) => {
    return this.props.serviceStore!.post(service).then(() => {
      this.setState({ submitted: true });
      const idOfNewService = this.props!.serviceStore!.service!.id;
      this.props.history.replace('/services/' + idOfNewService);
    });
  };

  @computed
  get serviceRates() {
    return this.props.rateGroupStore!.rateGroups.map((g: RateGroup) => ({
      rate_group_id: g.id,
      rate_unit_id: null,
      value: '',
    }));
  }

  @computed
  get service(): Service {
    return {
      id: undefined,
      name: '',
      description: '',
      vat: 0.077,
      chargeable: true,
      archived: false,
      service_rates: this.serviceRates as any,
    };
  }

  public render() {
    //wait for serviceRates to be loaded so the initialValues are populated correctly
    return (
      <ServiceForm
        title={'Service erstellen'}
        onSubmit={this.handleSubmit}
        service={this.service}
        loading={!hasContent(this.serviceRates)}
        submitted={this.state.submitted}
      />
    );
  }
}
