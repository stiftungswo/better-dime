import * as React from 'react';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Column } from '../../layout/Overview';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { InputFieldWithValidation } from '../../form/fields/common';
import { Field } from 'formik';
import { ProjectCategory, ProjectCategoryStore } from '../../stores/projectCategoryStore';
import { projectCategorySchema, projectCategoryTemplate } from './projectCategorySchema';

interface Props {
  mainStore?: MainStore;
  projectCategoryStore?: ProjectCategoryStore;
}

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
        schema={projectCategorySchema}
        defaultValues={projectCategoryTemplate}
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
