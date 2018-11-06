import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { OfferListing, OfferStore } from '../../stores/offerStore';
import compose from '../../utilities/compose';
import Overview, { Column } from '../../layout/Overview';
import { todo } from '../../index';
import { ActionButtons } from '../../layout/ActionButtons';

export interface Props {
  offerStore?: OfferStore;
}

@compose(
  inject('offerStore'),
  observer
)
export default class OfferOverview extends React.Component<Props> {
  public columns: Array<Column<OfferListing>>;

  constructor(props: Props) {
    super(props);
    this.columns = [
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
    return (
      <Overview
        title={'Offerten'}
        store={this.props.offerStore!}
        addAction={'/offers/new'}
        renderActions={e => <ActionButtons copyAction={todo} editAction={`/offers/${e.id}`} archiveAction={todo} deleteAction={todo} />}
        onClickRow={'/offers/:id'}
        columns={this.columns}
      />
    );
  }
}
