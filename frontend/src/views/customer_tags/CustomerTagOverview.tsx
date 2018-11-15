import * as React from 'react';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Column } from '../../layout/Overview';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import * as yup from 'yup';
import { InputFieldWithValidation } from '../../form/fields/common';
import { Field } from 'formik';
import { CustomerTagStore, CustomerTag } from '../../stores/customerTagStore';

interface Props {
  mainStore?: MainStore;
  customerTagStore?: CustomerTagStore;
}

const schema = yup.object({
  name: yup.string().required(),
});

const defaultValues = {
  name: '',
};

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

  public renderActions = (customerTag: CustomerTag) => (
    <ActionButtons deleteAction={() => this.props.customerTagStore!.delete(customerTag.id!)} />
  );

  public filter = (r: CustomerTag, query: string) => r.name.includes(query);

  public render() {
    return (
      <EditableOverview
        title={'Tags'}
        store={this.props.customerTagStore!}
        columns={this.columns}
        schema={schema}
        defaultValues={defaultValues}
        searchFilter={this.filter}
        renderActions={this.renderActions}
        renderForm={() => (
          <>
            {/* <Field component={NumberFieldWithValidation} name={'id'} label={'ID'} fullWidth /> */}
            <Field component={InputFieldWithValidation} name={'name'} label={'Name'} fullWidth multiline={true} />
          </>
        )}
      />
    );
  }
}
