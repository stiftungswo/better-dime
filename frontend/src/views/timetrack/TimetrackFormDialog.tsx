import React from 'react';
import { Field, Formik, FormikBag, FormikProps, FormikValues } from 'formik';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { ProjectSelector } from '../../form/entitySelector/ProjectSelector';
import { DatePicker } from '../../form/fields/DatePicker';
import { EffortStore } from '../../stores/effortStore';
import * as yup from 'yup';
import { ProjectComment, ProjectEffort, ProjectEffortTemplate } from '../../types';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../../stores/mainStore';
import { ProjectPositionSelector } from '../../form/entitySelector/ProjectPositionSelector';
import { EffortValueField } from '../../form/fields/timetrack/EffortValueField';
import Dialog from '@material-ui/core/Dialog/Dialog';
import { DialogContent, DialogTitle, withMobileDialog } from '@material-ui/core';
import { InjectedProps } from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button/Button';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import { TextField } from '../../form/fields/common';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import moment from 'moment';
import { ProjectStore } from '../../stores/projectStore';
import { captureException } from '../../utilities/helpers';

interface Props {
  onClose: () => void;
  effortStore?: EffortStore;
  mainStore?: MainStore;
  projectCommentStore?: ProjectCommentStore;
  timetrackFilterStore?: TimetrackFilterStore;
  projectStore?: ProjectStore;
}

const schema = yup.object({
  comment: yup.string(),
  employee_id: yup.number().required(),
  position_id: yup.number().required(),
  date: yup.string().required(),
  value: yup.number().required(),
});

@compose(
  inject('effortStore', 'projectStore', 'mainStore', 'projectCommentStore', 'timetrackFilterStore'),
  observer,
  withMobileDialog()
)
export class TimetrackFormDialog extends React.Component<Props & InjectedProps> {
  public handleSubmit = async (entity: ProjectEffort | ProjectEffortTemplate, formikProps: FormikProps<ProjectEffort>) => {
    const filter = this.props.timetrackFilterStore!.filter;
    const effortStore = this.props.effortStore!;

    if (effortStore.entity && 'employee_id' in entity) {
      await effortStore.put(entity);
    } else if ('employee_ids' in entity) {
      await Promise.all([
        this.widenFilterSettings(entity),
        ...entity.employee_ids.map((e: number) => {
          const newEffort: ProjectEffort = { employee_id: e, ...entity } as ProjectEffort;
          return effortStore.post(newEffort);
        }),
      ]);
    }

    if ('comment' in entity && entity.comment !== '') {
      const newProjectComment: ProjectComment = { ...entity } as ProjectComment;
      await this.props.projectCommentStore!.post(newProjectComment);
      await this.props.projectCommentStore!.fetchFiltered(filter);
    }

    await effortStore.fetchFiltered(filter);
    formikProps.setSubmitting(false);
  };

  //widen the filter so the newly added entities are displayed
  private widenFilterSettings = async (entity: ProjectEffortTemplate) => {
    const filter = this.props.timetrackFilterStore!.filter;

    if (filter.employeeIds.length > 0) {
      const allIds = new Set(filter.employeeIds);
      entity.employee_ids.forEach(id => allIds.add(id));
      filter.employeeIds = Array.from(allIds.values());
    }

    if (filter.projectIds.length > 0) {
      const allIds = new Set(filter.projectIds);
      allIds.add(entity.project_id!);
      filter.projectIds = Array.from(allIds.values());
    }

    if (filter.serviceIds.length > 0) {
      try {
        await this.props.projectStore!.fetchOne(entity.project_id!);
        const position = this.props.projectStore!.project!.positions.find(pos => pos.id === entity.position_id)!;
        const allIds = new Set(filter.serviceIds);
        allIds.add(position.service_id);
        filter.serviceIds = Array.from(allIds.values());
      } catch (e) {
        captureException(e);
      }
    }

    const effortDate = moment(entity.date);
    const filterEnd = moment(filter.end);
    const filterStart = moment(filter.start);

    if (effortDate.isAfter(filterEnd)) {
      filter.end = effortDate.format('YYYY-MM-DD');
    }

    if (effortDate.isBefore(filterStart)) {
      filter.start = effortDate.format('YYYY-MM-DD');
    }
  };

  public handleClose = (props: FormikProps<ProjectEffort>) => () => {
    if (props.dirty) {
      if (confirm('Änderungen verwerfen?')) {
        this.props.onClose();
      }
    } else {
      this.props.onClose();
    }
  };

  public render() {
    const { fullScreen } = this.props;

    return (
      <Formik
        initialValues={this.props.effortStore!.effort || this.props.effortStore!.effortTemplate!}
        onSubmit={this.handleSubmit}
        validationSchema={schema}
        render={(formikProps: FormikProps<ProjectEffort>) => (
          <Dialog open onClose={this.handleClose(formikProps)} fullScreen={fullScreen}>
            <DialogTitle>Leistung {formikProps.values.id ? 'bearbeiten' : 'erfassen'}</DialogTitle>

            <DialogContent>
              {!formikProps.values.id && <Field portal isMulti component={EmployeeSelector} name={'employee_ids'} label={'Mitarbeiter'} />}
              {formikProps.values.id && <Field portal component={EmployeeSelector} name={'employee_id'} label={'Mitarbeiter'} />}
              <Field portal component={ProjectSelector} name={'project_id'} label={'Projekt'} />
              <Field portal formProps={formikProps} component={ProjectPositionSelector} name={'position_id'} label={'Aktivität'} />
              <Field component={DatePicker} name={'date'} label={'Datum'} fullWidth />
              {formikProps.values.project_id && formikProps.values.position_id && (
                <>
                  <Field component={EffortValueField} name={'value'} label={'Wert'} fullWidth />
                  {!formikProps.values.id && (
                    <Field
                      delayed
                      fullWidth
                      multiline
                      component={TextField}
                      name={'comment'}
                      label={'Kommentar zu Projekt und Tag'}
                      margin={'none'}
                    />
                  )}
                </>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={this.handleClose(formikProps)}>Abbruch</Button>
              <Button
                onClick={async () => {
                  await this.handleSubmit(formikProps.values, formikProps);
                  this.props.effortStore!.editing = false;
                }}
                disabled={formikProps.isSubmitting}
              >
                Speichern
              </Button>
              {!formikProps.values.id && (
                <Button onClick={() => this.handleSubmit(formikProps.values, formikProps)} disabled={formikProps.isSubmitting}>
                  Speichern und weiter
                </Button>
              )}
            </DialogActions>
          </Dialog>
        )}
      />
    );
  }
}
