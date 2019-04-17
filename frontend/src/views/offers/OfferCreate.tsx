import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { MainStore } from '../../stores/mainStore';
import { OfferStore } from '../../stores/offerStore';
import { RateGroupStore } from '../../stores/rateGroupStore';
import { FormValues, Offer } from '../../types';
import compose from '../../utilities/compose';
import OfferForm from './OfferForm';
import { offerTemplate } from './offerSchema';

export interface Props extends RouteComponentProps {
  offerStore?: OfferStore;
  mainStore?: MainStore;
  rateGroupStore?: RateGroupStore;
}

@compose(
  inject('offerStore', 'mainStore'),
  observer,
)
export default class OfferCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  handleSubmit = (offer: Offer) => {
    return this.props.offerStore!.post(offer).then(() => {
      this.setState({ submitted: true });
      const idOfNewOffer = this.props!.offerStore!.offer!.id;
      this.props.history.replace('/offers/' + idOfNewOffer);
    });
  }

  render() {
    return (
      <OfferForm
        title={'Offerte erstellen'}
        onSubmit={this.handleSubmit}
        offer={
          {
            ...offerTemplate,
            accountant_id: this.props.mainStore!.userId!,
          } as FormValues
        }
        submitted={this.state.submitted}
      />
    );
  }
}
