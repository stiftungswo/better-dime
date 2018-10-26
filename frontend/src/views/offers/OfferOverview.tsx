import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { OfferListing, OfferStore } from '../../stores/offerStore';
import { Link } from 'react-router-dom';
import compose from '../../utilities/compose';

export interface Props {
  offerStore?: OfferStore;
}

@compose(
  inject('offerStore'),
  observer
)
export default class OfferOverview extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.offerStore!.fetchAll();
  }

  public render() {
    return (
      <ul>
        {this.props!.offerStore!.offers.length === 0 && <p>Keine Offerten.</p>}
        {this.props!.offerStore!.offers.map((offer: OfferListing) => (
          <li key={offer.id}>
            <Link to={`/offer/${offer.id}`}>
              <h3>{offer.name}</h3>
            </Link>
            <p>
              <i>{offer.shortDescription}</i>
            </p>
          </li>
        ))}
      </ul>
    );
  }
}
