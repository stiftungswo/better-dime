import * as React from 'react';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Column } from '../../layout/Overview';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { CustomerTagStore } from '../../stores/customerTagStore';
import { customerTagSchema, customerTagTemplate } from './customerTagSchema';
import { CustomerTag } from '../../types';
import { DimeField } from '../../form/fields/formik';
import { SwitchField, TextField } from '../../form/fields/common';

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

  public render() {
    const customerTagStore = this.props.customerTagStore;

    return (
      <EditableOverview
        archivable
        searchable
        title={'Tags'}
        store={customerTagStore!}
        columns={this.columns}
        schema={customerTagSchema}
        defaultValues={customerTagTemplate}
        renderActions={(e: CustomerTag) => (
          <ActionButtons
            archiveAction={!e.archived ? () => customerTagStore!.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => customerTagStore!.archive(e.id, false) : undefined}
          />
        )}
        renderForm={() => (
          <>
            <DimeField delayed component={TextField} name={'name'} label={'Name'} fullWidth />
            <DimeField delayed component={SwitchField} name={'archived'} label={'Archiviert?'} fullWidth />
          </>
        )}
      />
    );
  }
}
