import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { OfferStore } from '../../stores/offerStore';
import compose from '../../utilities/compose';
import Overview, { Column } from '../../layout/Overview';
import { ActionButtons } from '../../layout/ActionButtons';
import { RouteComponentProps, withRouter } from 'react-router';
import { Offer, OfferListing } from '../../types';

type Props = {
  offerStore?: OfferStore;
} & RouteComponentProps;

@compose(
  inject('offerStore'),
  observer,
  withRouter
)
export default class OfferOverview extends React.Component<Props> {
  public columns: Column<OfferListing>[];

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

  public render() {
    const offerStore = this.props.offerStore!;
    return (
      <Overview
        searchable
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
              'Willst du diese Offerte wirklich löschen? Falls ein Projekt aus der Offerte erstellt wurde, kann dessen Restbudget nicht mehr berechnet werden. Zusätzlich werden die Abzüge bei der Erstellung einer Rechnung nicht mehr automatisch gesetzt.'
            }
          />
        )}
        onClickRow={'/offers/:id'}
        columns={this.columns}
      />
    );
  }
}
