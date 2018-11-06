import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import OfferForm from './OfferForm';
import compose from '../../utilities/compose';
import { OfferStore } from '../../stores/offerStore';
import { Offer } from '../../types';

interface OfferDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<OfferDetailRouterProps>, InjectedNotistackProps {
  offerStore?: OfferStore;
}

@compose(
  inject('offerStore'),
  observer
)
export default class OfferUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.offerStore!.fetchOne(Number(props.match.params.id));
  }

  public handleSubmit = (offer: Offer) => {
    return this.props.offerStore!.put(offer);
  };

  public get offer() {
    const offer = this.props.offerStore!.offer;
    if (offer) {
      return {
        ...offer,
        fixed_price: offer.fixed_price || '',
      };
    } else {
      return undefined;
    }
  }

  public render() {
    const offer = this.offer;
    const title = offer ? `${offer.name} - Offerten` : 'Offerte bearbeiten';

    return <OfferForm title={title} onSubmit={this.handleSubmit} offer={offer as any} />;
  }
}
