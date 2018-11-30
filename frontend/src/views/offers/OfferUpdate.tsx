import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { InjectedNotistackProps } from 'notistack';
import OfferForm from './OfferForm';
import compose from '../../utilities/compose';
import { OfferStore } from '../../stores/offerStore';
import { FormValues, Offer } from '../../types';
import { toJS } from 'mobx';

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
    return toJS(this.props.offerStore!.offer);
  }

  public render() {
    const offer = this.offer;
    const title = offer ? `${offer.name} - Offerten` : 'Offerte bearbeiten';

    return <OfferForm title={title} onSubmit={this.handleSubmit} offer={offer as FormValues} />;
  }
}
