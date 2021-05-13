import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { OfferStore } from '../../stores/offerStore';
import { FormValues, Offer } from '../../types';
import compose from '../../utilities/compose';
import OfferForm from './OfferForm';

interface OfferDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<OfferDetailRouterProps> {
  offerStore?: OfferStore;
}

@compose(
  inject('offerStore'),
  observer,
)
export default class OfferUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.offerStore!.fetchOne(Number(props.match.params.id));
  }

  handleSubmit = (offer: Offer) => {
    return this.props.offerStore!.put(offer);
  }

  get offer() {
    return toJS(this.props.offerStore!.offer);
  }

  render() {
    const offer = this.offer;
    const title = offer ? `${offer.name} - Offerten` : 'Offerte bearbeiten';

    return <OfferForm title={title} onSubmit={this.handleSubmit} offer={offer as FormValues} showDateField={true} />;
  }
}
