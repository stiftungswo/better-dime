import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { ActionButtons } from '../../layout/ActionButtons';
import Overview, { Column } from '../../layout/Overview';
import { OfferStore } from '../../stores/offerStore';
import { Offer, OfferListing } from '../../types';
import compose from '../../utilities/compose';

type Props = {
  offerStore?: OfferStore;
} & RouteComponentProps;

@compose(
  inject('offerStore'),
  observer,
  withRouter,
)
export default class OfferOverview extends React.Component<Props> {
  columns: Array<Column<OfferListing>>;

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'id',
        label: 'ID',
        numeric: true,
      },
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'short_description',
        label: 'Beschreibung',
      },
    ];
  }

  render() {
    const offerStore = this.props.offerStore!;
    return (
      <Overview
        searchable
        paginated
        title={'Offerten'}
        store={offerStore}
        addAction={'/offers/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              const newEntity: Offer = await offerStore!.duplicate(e.id);
              this.props.history.push(`/offers/${newEntity.id}`);
            }}
            deleteAction={() => offerStore!.delete(e.id)}
            deleteMessage={
              'Willst du diese Offerte wirklich löschen? ' +
              'Falls ein Projekt aus der Offerte erstellt wurde, kann dessen Restbudget nicht mehr berechnet werden. ' +
              'Zusätzlich werden die Abzüge bei der Erstellung einer Rechnung nicht mehr automatisch gesetzt.'
            }
          />
        )}
        onClickRow={'/offers/:id'}
        columns={this.columns}
      />
    );
  }
}
