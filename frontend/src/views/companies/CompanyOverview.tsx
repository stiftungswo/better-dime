import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { CompanyStore, Company } from '../../stores/companyStore';
import Overview, { Column } from '../../layout/Overview';
import { todo } from '../../index';
import compose from '../../utilities/compose';
import { ActionButtons } from '../../layout/ActionButtons';

interface Props {
  companyStore?: CompanyStore;
}

@compose(
  inject('companyStore'),
  observer
)
export default class CompanyOverview extends React.Component<Props> {
  public columns: Array<Column<Company>>;

  constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'name',
        label: 'Name',
      },
      {
        id: 'email',
        label: 'E-Mail',
      },
      {
        id: '',
        label: 'Telefon',
        format: c => <>{c.phone_numbers ? (c.phone_numbers.length > 0 ? c.phone_numbers[0].number : '') : ''}</>,
      },
    ];
  }

  public render() {
    return (
      <Overview
        title={'Firma'}
        store={this.props.companyStore!}
        addAction={'/companies/new'}
        renderActions={e => <ActionButtons copyAction={todo} editAction={`/companies/${e.id}`} archiveAction={todo} deleteAction={todo} />}
        onClickRow={'/companies/:id'}
        columns={this.columns}
      />
    );
  }
}
