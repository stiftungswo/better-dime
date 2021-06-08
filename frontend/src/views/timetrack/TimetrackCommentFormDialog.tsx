import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { InjectedProps } from '@material-ui/core/es/withMobileDialog';
import { FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FormikSubmitDetector } from 'src/form/FormikSubmitDetector';
import * as yup from 'yup';
import {ProjectCommentPresetSelect} from '../../form/entitySelect/ProjectCommentPresetSelect';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import { DatePicker } from '../../form/fields/DatePicker';
import { DimeField } from '../../form/fields/formik';
import { FormDialog } from '../../form/FormDialog';
import { MainStore } from '../../stores/mainStore';
import {ProjectCommentPresetStore} from '../../stores/projectCommentPresetStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { ProjectComment } from '../../types';
import compose from '../../utilities/compose';
import { dimeDate, localizeSchema, selector } from '../../utilities/validation';

interface Props extends InjectedProps {
  onClose: () => void;
  projectCommentStore?: ProjectCommentStore;
  projectCommentPresetStore?: ProjectCommentPresetStore;
  mainStore?: MainStore;
  timetrackFilterStore?: TimetrackFilterStore;
}

interface State {
  lastEntry?: ProjectComment;
  closeAfterSubmit: boolean;
}

const schema = localizeSchema(() =>
  yup.object({
    comment: yup.string().nullable(true),
    date: dimeDate(),
    project_id: selector(),
  }),
);

@compose(
  inject('projectCommentStore', 'projectCommentPresetStore', 'timetrackFilterStore', 'mainStore'),
  observer,
)
export class TimetrackCommentFormDialog extends React.Component<Props, State> {

  state = {
    lastEntry: undefined,
    closeAfterSubmit: false,
  };

  handleSubmit = async (entity: ProjectComment, formikProps: FormikProps<ProjectComment>) => {
    const projectCommentStore = this.props.projectCommentStore!;
    if (projectCommentStore.entity) {
      await projectCommentStore.put(schema.cast(entity));
    } else {
      if (schema.cast(entity)?.comment != null) {
        await projectCommentStore.post(schema.cast(entity));
        await this.widenFilterSettings(entity);
      }
    }
    await projectCommentStore.fetchWithProjectEffortFilter(this.props.timetrackFilterStore!.filter);
    formikProps.setSubmitting(false);
    this.setState({ lastEntry: entity });
    if (this.state.closeAfterSubmit) {
      projectCommentStore.editing = false;
    }
  }

  handleClose = (props: FormikProps<ProjectComment>) => () => {
    if (props.dirty) {
      if (confirm('Die Änderungen wurden noch nicht gespeichert. Verwerfen?')) {
        this.props.onClose();
      }
    } else {
      this.props.onClose();
    }
  }

  componentDidMount(): void {
    Promise.all([
      this.props.projectCommentPresetStore!.fetchAll(),
    ]);
  }

  render() {
    const { fullScreen } = this.props;

    return (
      <FormDialog
        initialValues={this.state.lastEntry || this.props.projectCommentStore!.projectComment || this.props.projectCommentStore!.projectCommentTemplate!}
        isInitialValid={true}
        validationSchema={schema}
        enableReinitialize
        onSubmit={this.handleSubmit}
        render={(formikProps: FormikProps<ProjectComment>) => (
          <FormikSubmitDetector {...formikProps}>
            <Dialog open onClose={this.handleClose(formikProps)} fullScreen={fullScreen} maxWidth="lg">
              <DialogTitle>Projekt-Kommentar erfassen</DialogTitle>

              <DialogContent>
                <DimeField component={DatePicker} name={'date'} label={'Datum'} />
                <DimeField component={ProjectSelect} name={'project_id'} label={'Projekt'} />
                <DimeField component={ProjectCommentPresetSelect} name={'comment'} label={'Kommentar'} />
              </DialogContent>

              <DialogActions>
                  <Button onClick={this.handleClose(formikProps)}>Abbruch</Button>
                  <Button
                    onClick={() => this.setState({ closeAfterSubmit: true }, formikProps.submitForm)}
                    disabled={formikProps.isSubmitting}
                  >
                    Speichern
                  </Button>
                  {!formikProps.values.id && (
                    <Button
                      onClick={() => this.setState({ closeAfterSubmit: false }, formikProps.submitForm)}
                      disabled={formikProps.isSubmitting}
                    >
                      Speichern und weiter
                    </Button>
                  )}
                </DialogActions>
              </Dialog>
          </FormikSubmitDetector>
        )}
      />
    );
  }

  // widen the filter so the newly added entities are displayed
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
  }
}
