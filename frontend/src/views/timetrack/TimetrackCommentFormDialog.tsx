import React from 'react';
import { MainStore } from '../../stores/mainStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import * as yup from 'yup';
import { FormDialog } from '../../form/FormDialog';
import { HandleFormikSubmit, ProjectComment } from '../../types';
import { Field, FormikBag } from 'formik';
import { ProjectSelector } from '../../form/entitySelector/ProjectSelector';
import { DatePicker } from '../../form/fields/DatePicker';
import { TextField } from '../../form/fields/common';

interface Props {
  onClose: () => void;
  projectCommentStore?: ProjectCommentStore;
  mainStore?: MainStore;
}

const schema = yup.object({
  comment: yup.string().required(),
  date: yup.string().required(),
  project_id: yup.number().required(),
});

@compose(
  inject('projectCommentStore', 'mainStore'),
  observer
)
export class TimetrackCommentFormDialog extends React.Component<Props> {
  public handleSubmit = (entity: ProjectComment) => {
    if (this.props.projectCommentStore!.entity) {
      this.props.projectCommentStore!.put(entity).then(() => (this.props.projectCommentStore!.editing = false));
    } else {
      this.props.projectCommentStore!.post(entity).then(() => (this.props.projectCommentStore!.editing = false));
    }
    return Promise.resolve();
  };

  public render() {
    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title={'Projekt-Kommentar erfassen'}
        initialValues={this.props.projectCommentStore!.projectComment || this.props.projectCommentStore!.projectCommentTemplate!}
        validationSchema={schema}
        onSubmit={this.handleSubmit}
        render={() => (
          <>
            <Field component={DatePicker} name={'date'} label={'Datum'} fullWidth />
            <Field component={ProjectSelector} name={'project_id'} label={'Projekt'} fullWidth />
            <Field component={TextField} name={'comment'} label={'Kommentar'} fullWidth multiline rowsMax={6} />
          </>
        )}
      />
    );
  }
}
