import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { OfferStore } from '../../stores/offerStore';
import { Offer, OfferListing } from '../../types';
import compose from '../../utilities/compose';

type Props = {
  offerStore?: OfferStore;
  intl?: IntlShape;
} & RouteComponentProps;

@compose(
  injectIntl,
  inject('offerStore'),
  observer,
  withRouter,
)
export default class OfferOverview extends React.Component<Props> {

  render() {
    const offerStore = this.props.offerStore!;
    // columns have to be reconstructed on every render(),
    // as the locale might have changed.
    const intl = this.props.intl!;
    const columns = [
      {
        id: 'id',
        label: 'ID',
        numeric: true,
      },
      {
        id: 'name',
        label: intl.formatMessage({id: 'general.name'}),
      },
      {
        id: 'short_description',
        label: intl.formatMessage({id: 'general.description'}),
      },
    ];

    return (
      <Overview
        searchable
        paginated
        title={intl.formatMessage({id: 'general.offer.plural'})}
        store={offerStore}
        addAction={'/offers/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              if (e.id) {
                const newEntity: Offer = await offerStore!.duplicate(e.id);
                this.props.history.push(`/offers/${newEntity.id}`);
              }
            }}
            deleteAction={() => {
              if (e.id) {
                offerStore!.delete(e.id).then(r => offerStore!.fetchAllPaginated());
              }
            }}
            deleteMessage={intl.formatMessage({id: 'view.offer.overview.delete_warning'})}
          />
        )}
        onClickRow={'/offers/:id'}
        columns={columns}
      />
    );
  }
}
