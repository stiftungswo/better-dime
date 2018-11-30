import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { OfferStore } from '../../stores/offerStore';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import OfferForm from './OfferForm';
import compose from '../../utilities/compose';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { FormValues, Offer } from '../../types';
import { offerTemplate } from './offerSchema';

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

  public handleSubmit = (offer: Offer) => {
    return this.props.offerStore!.post(offer).then(() => {
      this.setState({ submitted: true });
      const idOfNewOffer = this.props!.offerStore!.offer!.id;
      this.props.history.replace('/offers/' + idOfNewOffer);
    });
  };

  public render() {
    return (
      <OfferForm
        title={'Offerte erstellen'}
        onSubmit={this.handleSubmit}
        offer={offerTemplate as FormValues}
        submitted={this.state.submitted}
      />
    );
  }
}
