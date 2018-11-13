import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { OfferStore } from '../../stores/offerStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import OfferForm from './OfferForm';
import compose from '../../utilities/compose';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { computed } from 'mobx';
import { Offer } from '../../types';

export interface Props extends RouteComponentProps, InjectedNotistackProps {
  offerStore?: OfferStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('offerStore'),
  observer
)
export default class OfferCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  constructor(props: Props) {
    super(props);
  }

  public handleSubmit = (offer: Offer) => {
    return this.props.offerStore!.post(offer).then(() => {
      this.setState({ submitted: true });
      const idOfNewOffer = this.props!.offerStore!.offer!.id;
      this.props.history.replace('/offers/' + idOfNewOffer);
    });
  };

  @computed
  get offer(): any {
    return {
      id: undefined,
      name: '',
      status: 1,
      short_description: '',
      description: '',
      positions: [],
      discounts: [],
    };
  }

  public render() {
    return <OfferForm title={'Offerte erstellen'} onSubmit={this.handleSubmit} offer={this.offer} submitted={this.state.submitted} />;
  }
}
