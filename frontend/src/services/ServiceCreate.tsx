import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { ServiceStore } from '../store/serviceStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps, withSnackbar } from 'notistack';
import ServiceForm from './ServiceForm';
import compose from '../compose';
import { Service } from './types';
import { RateGroup, RateGroupStore } from '../store/rateGroupStore';
import { computed } from 'mobx';
import { Loading } from '../utilities/DimeLayout';

export interface Props extends RouteComponentProps, InjectedNotistackProps {
  serviceStore?: ServiceStore;
  rateGroupStore?: RateGroupStore;
}

@inject('serviceStore', 'rateGroupStore')
@observer
class ServiceCreate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.rateGroupStore!.fetchAll();
  }

  public handleSubmit = (service: Service) => {
    return this.props.serviceStore!.post(service).then(() => {
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
      <Loading entity={this.serviceRates}>
        <ServiceForm handleSubmit={this.handleSubmit} service={this.service} />
      </Loading>
    );
  }
}

export default compose(withSnackbar(ServiceCreate));
