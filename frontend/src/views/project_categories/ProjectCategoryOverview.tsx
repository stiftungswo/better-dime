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
import { ProjectCategoryStore, ProjectCategory } from '../../stores/projectCategoryStore';

interface Props {
  mainStore?: MainStore;
  projectCategoryStore?: ProjectCategoryStore;
}

const schema = yup.object({
  name: yup.string().required(),
});

const defaultValues = {
  name: '',
};

@compose(
  inject('mainStore', 'projectCategoryStore'),
  observer
)
export default class ProjectCategoryOverview extends React.Component<Props> {
  public columns: Array<Column<ProjectCategory>> = [];

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

  public renderActions = (projectCategory: ProjectCategory) => (
    <ActionButtons deleteAction={() => this.props.projectCategoryStore!.delete(projectCategory.id!)} />
  );

  public filter = (r: ProjectCategory, query: string) => r.name.includes(query) || r.description.includes(query);

  public render() {
    return (
      <EditableOverview
        title={'Tätigkeitsbereiche'}
        store={this.props.projectCategoryStore!}
        columns={this.columns}
        schema={schema}
        defaultValues={defaultValues}
        searchFilter={this.filter}
        renderActions={this.renderActions}
        renderForm={() => (
          <>
            {/* <Field component={NumberFieldWithValidation} name={'id'} label={'ID'} fullWidth /> */}
            <Field component={InputFieldWithValidation} name={'name'} label={'Name'} fullWidth />
          </>
        )}
      />
    );
  }
}
