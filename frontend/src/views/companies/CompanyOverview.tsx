import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Company, CompanyStore } from '../../stores/companyStore';
import Overview, { Column } from '../../layout/Overview';
import { todo } from '../../index';
import compose from '../../utilities/compose';
import { ActionButtons } from '../../layout/ActionButtons';
import { RouteComponentProps, withRouter } from 'react-router';

type Props = {
  companyStore?: CompanyStore;
} & RouteComponentProps;

@compose(
  inject('companyStore'),
  observer,
  withRouter
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
    const companyStore = this.props.companyStore!;

    return (
      <Overview
        title={'Firma'}
        store={companyStore!}
        addAction={'/companies/new'}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              const newEntity: Company = await companyStore!.duplicate(e.id);
              this.props.history.push(`/companies/${newEntity.id}`);
            }}
            archiveAction={todo}
            deleteAction={todo}
          />
        )}
        onClickRow={'/companies/:id'}
        columns={this.columns}
      />
    );
  }
}
