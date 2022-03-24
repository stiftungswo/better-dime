import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
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
  intl?: IntlShape;
}

@compose(
  injectIntl,
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
    const intl = this.props.intl!;
    return (
      <OfferForm
        title={intl.formatMessage({id: 'view.offer.create.title'})}
        onSubmit={this.handleSubmit}
        offer={
          {
            ...offerTemplate(),
            accountant_id: this.props.mainStore!.userId!,
          } as FormValues
        }
        submitted={this.state.submitted}
      />
    );
  }
}
