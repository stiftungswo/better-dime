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
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { dimeDate } from '../../utilities/validationHelpers';
import moment from 'moment';

interface Props {
  onClose: () => void;
  projectCommentStore?: ProjectCommentStore;
  mainStore?: MainStore;
  timetrackFilterStore?: TimetrackFilterStore;
}

const schema = yup.object({
  comment: yup.string().required(),
  date: dimeDate(),
  project_id: yup.number().required(),
});

@compose(
  inject('projectCommentStore', 'timetrackFilterStore', 'mainStore'),
  observer
)
export class TimetrackCommentFormDialog extends React.Component<Props> {
  public handleSubmit = async (entity: ProjectComment) => {
    const projectCommentStore = this.props.projectCommentStore!;
    if (projectCommentStore.entity) {
      await projectCommentStore.put(schema.cast(entity));
    } else {
      await projectCommentStore.post(schema.cast(entity));
      await this.widenFilterSettings(entity);
    }
    await projectCommentStore.fetchFiltered(this.props.timetrackFilterStore!.filter);
    projectCommentStore.editing = false;
  };

  //widen the filter so the newly added entities are displayed
  private widenFilterSettings = async (entity: ProjectComment) => {
    const filter = this.props.timetrackFilterStore!.filter;

    this.props.timetrackFilterStore!.grouping = 'project';

    if (filter.projectIds.length > 0) {
      const allIds = new Set(filter.projectIds);
      allIds.add(entity.project_id!);
      filter.projectIds = Array.from(allIds.values());
    }

    const commentDate = moment(entity.date);
    const filterEnd = moment(filter.end);
    const filterStart = moment(filter.start);

    if (commentDate.isAfter(filterEnd)) {
      filter.end = commentDate.clone();
    }

    if (commentDate.isBefore(filterStart)) {
      filter.start = commentDate.clone();
    }
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
