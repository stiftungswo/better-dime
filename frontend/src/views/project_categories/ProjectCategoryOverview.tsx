import * as React from 'react';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Column } from '../../layout/Overview';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { SwitchField, TextField } from '../../form/fields/common';
import { ProjectCategoryStore } from '../../stores/projectCategoryStore';
import { projectCategorySchema, projectCategoryTemplate } from './projectCategorySchema';
import { ProjectCategory } from '../../types';
import { DimeField } from '../../form/fields/formik';

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

  public render() {
    const projectCategoryStore = this.props.projectCategoryStore;

    return (
      <EditableOverview
        archivable
        searchable
        title={'Tätigkeitsbereiche'}
        store={projectCategoryStore!}
        columns={this.columns}
        schema={projectCategorySchema}
        defaultValues={projectCategoryTemplate}
        renderActions={(e: ProjectCategory) => (
          <ActionButtons
            archiveAction={!e.archived ? () => projectCategoryStore!.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => projectCategoryStore!.archive(e.id, false) : undefined}
          />
        )}
        renderForm={() => (
          <>
            <DimeField component={TextField} name={'name'} label={'Name'} />
            <DimeField component={SwitchField} name={'archived'} label={'Archiviert?'} />
          </>
        )}
      />
    );
  }
}
