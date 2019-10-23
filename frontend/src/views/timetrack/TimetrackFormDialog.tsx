import { DialogContent, DialogTitle } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import { Formik, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import * as yup from 'yup';
import { EmployeeSelect } from '../../form/entitySelect/EmployeeSelect';
import { ProjectPositionSelect } from '../../form/entitySelect/ProjectPositionSelect';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import { TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { DateFastPicker } from '../../form/fields/timetrack/DateFastPicker';
import { EffortValueField } from '../../form/fields/timetrack/EffortValueField';
import { FormikSubmitDetector } from '../../form/FormikSubmitDetector';
import DimeDialog from '../../layout/DimeDialog';
import { apiDateFormat } from '../../stores/apiStore';
import { EffortStore } from '../../stores/effortStore';
import { MainStore } from '../../stores/mainStore';
import { ProjectCommentStore } from '../../stores/projectCommentStore';
import { ProjectStore } from '../../stores/projectStore';
import { TimetrackFilterStore } from '../../stores/timetrackFilterStore';
import { ProjectComment, ProjectEffort, ProjectEffortTemplate } from '../../types';
import { captureException } from '../../utilities/helpers';
import { dimeDate, localizeSchema, requiredNumber, selector } from '../../utilities/validation';

interface Props {
  onClose: () => void;
  effortStore?: EffortStore;
  mainStore?: MainStore;
  projectCommentStore?: ProjectCommentStore;
  timetrackFilterStore?: TimetrackFilterStore;
  projectStore?: ProjectStore;
}

interface State {
  lastEntry?: ProjectEffortTemplate | ProjectEffort;
  closeAfterSubmit: boolean;
}

const baseEffortFields = {
  comment: yup.string(),
  project_id: selector(),
  position_id: selector(),
  date: dimeDate().required(),
  value: requiredNumber(),
};

const soloSchema = localizeSchema(() =>
  yup
    .object({
      employee_id: yup.number().required(),
    })
    .shape(baseEffortFields),
);

const multiSchema = localizeSchema(() =>
  yup
    .object({
      employee_ids: yup
        .array()
        .of(yup.number())
        .min(1, 'Dies ist ein erforderliches Feld.'),
    })
    .shape(baseEffortFields),
);

class InnerTimetrackFormDialog extends React.Component<Props, State> {

  get mode() {
    return Boolean(this.props.effortStore!.effort) ? 'edit' : 'create';
  }

  state = {
    lastEntry: undefined,
    closeAfterSubmit: false,
  };
  handleSubmit = async (entity: ProjectEffort | ProjectEffortTemplate, formikProps: FormikProps<ProjectEffort>) => {
    const filter = this.props.timetrackFilterStore!.filter;
    const effortStore = this.props.effortStore!;

    if (effortStore.entity && 'employee_id' in entity) {
      await effortStore.put(soloSchema.cast(entity));
    } else if ('employee_ids' in entity) {
      await Promise.all([
        this.widenFilterSettings(entity),
        ...entity.employee_ids.map((e: number) => {
          const newEffort = { employee_id: e, ...entity, date: entity.date.format(apiDateFormat) } as ProjectEffort;
          return effortStore.post(soloSchema.cast(newEffort));
        }),
      ]);
    }

    if ('comment' in entity && entity.comment !== '') {
      const newProjectComment: ProjectComment = {
        ...entity,
        date: entity.date.format(apiDateFormat),
      } as ProjectComment;
      await this.props.projectCommentStore!.post(newProjectComment);
      await this.props.projectCommentStore!.fetchFiltered(filter);
    }

    await effortStore.fetchFiltered(filter);
    formikProps.setSubmitting(false);
    this.setState({ lastEntry: entity });
    if (this.state.closeAfterSubmit) {
      this.props.effortStore!.editing = false;
    }
  }

  handleClose = (props: FormikProps<ProjectEffort>) => () => {
    if (props.dirty) {
      if (confirm('Die Änderungen wurden noch nicht gespeichert. Verwerfen?')) {
        this.props.onClose();
      }
    } else {
      this.props.onClose();
    }
  }

  render() {
    return (
      <Formik
        initialValues={this.state.lastEntry || this.props.effortStore!.effort || this.props.effortStore!.effortTemplate!}
        enableReinitialize
        onSubmit={this.handleSubmit}
        validationSchema={this.mode === 'edit' ? soloSchema : multiSchema}
        render={(formikProps: FormikProps<ProjectEffort>) => (
          <FormikSubmitDetector {...formikProps}>
            <DimeDialog open onClose={this.handleClose(formikProps)}>
              <DialogTitle>Leistung {formikProps.values.id ? 'bearbeiten' : 'erfassen'}</DialogTitle>

              <DialogContent>
                {!formikProps.values.id && (
                  <DimeField menuPositionFixed isMulti component={EmployeeSelect} name={'employee_ids'} label={'Mitarbeiter'}/>
                )}
                {formikProps.values.id &&
                <DimeField menuPositionFixed component={EmployeeSelect} name={'employee_id'} label={'Mitarbeiter'}/>}
                <DimeField menuPositionFixed component={ProjectSelect} name={'project_id'} label={'Projekt'}/>
                <DimeField
                  menuPositionFixed
                  projectId={formikProps.values.project_id}
                  component={ProjectPositionSelect}
                  name={'position_id'}
                  label={'Aktivität'}
                />
                <DimeField component={DateFastPicker} name={'date'} label={'Datum'}/>
                {formikProps.values.project_id && formikProps.values.position_id && (
                  <>
                    <DimeField
                      component={EffortValueField}
                      positionId={formikProps.values.position_id}
                      name={'value'}
                      label={'Wert'}
                    />
                    {!formikProps.values.id && (
                      <DimeField
                        delayed
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
            </DimeDialog>
          </FormikSubmitDetector>
        )}
      />
    );
  }

  // widen the filter so the newly added entities are displayed
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
      filter.end = effortDate.clone();
    }

    if (effortDate.isBefore(filterStart)) {
      filter.start = effortDate.clone();
    }
  }
}

// manual chaining of the components here since withMobileDialog wouldn't be applied correctly with compose
export const TimetrackFormDialog = inject(
  'effortStore', 'projectStore', 'mainStore', 'projectCommentStore', 'timetrackFilterStore')(
  observer(InnerTimetrackFormDialog));
