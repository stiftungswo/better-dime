import * as React from 'react';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Column } from '../../layout/Overview';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { InputFieldWithValidation, SwitchField } from '../../form/fields/common';
import { Field } from 'formik';
import { CustomerTag, CustomerTagStore } from '../../stores/customerTagStore';
import { customerTagSchema, customerTagTemplate } from './customerTagSchema';

interface Props {
  mainStore?: MainStore;
  customerTagStore?: CustomerTagStore;
}

@compose(
  inject('mainStore', 'customerTagStore'),
  observer
)
export default class CustomerTagOverview extends React.Component<Props> {
  public columns: Array<Column<CustomerTag>> = [];

  public constructor(props: Props) {
    super(props);
    this.columns = [
      {
        id: 'id',
        numeric: false,
        label: 'ID',
      },
      {
        id: 'name',
        numeric: false,
        label: 'Name',
      },
    ];
  }

  public filter = (r: CustomerTag, query: string) => r.name.includes(query);

  public render() {
    const customerTagStore = this.props.customerTagStore;

    return (
      <EditableOverview
        archivable
        title={'Tags'}
        store={customerTagStore!}
        columns={this.columns}
        schema={customerTagSchema}
        defaultValues={customerTagTemplate}
        searchFilter={this.filter}
        renderActions={e => (
          <ActionButtons
            archiveAction={!e.archived ? () => customerTagStore!.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => customerTagStore!.archive(e.id, false) : undefined}
          />
        )}
        renderForm={() => (
          <>
            <Field delayed component={InputFieldWithValidation} name={'name'} label={'Name'} fullWidth />
            <Field delayed component={SwitchField} name={'archived'} label={'Archiviert?'} fullWidth />
          </>
        )}
      />
    );
  }
}
