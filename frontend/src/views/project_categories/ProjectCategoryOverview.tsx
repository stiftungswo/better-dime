import * as React from 'react';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Column } from '../../layout/Overview';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { InputFieldWithValidation, SwitchField } from '../../form/fields/common';
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

  public filter = (r: ProjectCategory, query: string) => r.name.includes(query);

  public render() {
    const projectCategoryStore = this.props.projectCategoryStore;

    return (
      <EditableOverview
        archivable
        title={'Tätigkeitsbereiche'}
        store={projectCategoryStore!}
        columns={this.columns}
        schema={projectCategorySchema}
        defaultValues={projectCategoryTemplate}
        searchFilter={this.filter}
        renderActions={(e: ProjectCategory) => (
          <ActionButtons
            archiveAction={!e.archived ? () => projectCategoryStore!.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => projectCategoryStore!.archive(e.id, false) : undefined}
          />
        )}
        renderForm={() => (
          <>
            <Field component={InputFieldWithValidation} name={'name'} label={'Name'} fullWidth />
            <Field component={SwitchField} name={'archived'} label={'Archiviert?'} fullWidth />
          </>
        )}
      />
    );
  }
}
