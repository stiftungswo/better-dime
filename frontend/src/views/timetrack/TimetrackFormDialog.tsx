import React from 'react';
import { Field, Formik, FormikBag, FormikProps } from 'formik';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { ProjectSelector } from '../../form/entitySelector/ProjectSelector';
import { DatePicker } from '../../form/fields/DatePicker';
import { EffortStore } from '../../stores/effortStore';
import * as yup from 'yup';
import { ProjectEffort, ProjectEffortTemplate } from '../../types';
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

interface Props {
  onClose: () => void;
  effortStore?: EffortStore;
  mainStore?: MainStore;
}

const schema = yup.object({
  employee_id: yup.number().required(),
  position_id: yup.number().required(),
  date: yup.string().required(),
  value: yup.number().required(),
});

@compose(
  inject('effortStore', 'mainStore'),
  observer,
  withMobileDialog()
)
export class TimetrackFormDialog extends React.Component<Props & InjectedProps> {
  public handleSubmit = async (entity: ProjectEffort | ProjectEffortTemplate, formikBag: FormikBag<any, any>) => {
    if (this.props.effortStore!.entity && 'employee_id' in entity) {
      await this.props.effortStore!.put(entity);
    } else if ('employee_ids' in entity) {
      entity.employee_ids.forEach(async (e: number) => {
        let toBeSaved: ProjectEffort = { employee_id: e, ...entity } as ProjectEffort;
        await this.props.effortStore!.post(toBeSaved);
      });
    }
    this.props.effortStore!.fetchAll();
    formikBag.setSubmitting(false);
  };

  public handleClose = (props: FormikProps<any>) => () => {
    if (props.dirty) {
      confirm('Änderungen verwerfen?') && this.props.onClose();
    } else {
      this.props.onClose();
    }
  };

  public render() {
    const { fullScreen } = this.props;

    return (
      <Formik
        initialValues={this.props.effortStore!.effort || this.props.effortStore!.effortTemplate!}
        onSubmit={this.handleSubmit as any}
        validationSchema={schema}
        render={(formikProps: any) => (
          <Dialog open onClose={this.handleClose(formikProps)} fullScreen={fullScreen}>
            <DialogTitle>Leistung {formikProps.values.id ? 'bearbeiten' : 'erfassen'}</DialogTitle>

            <DialogContent>
              {!formikProps.values.id && <Field portal isMulti component={EmployeeSelector} name={'employee_ids'} label={'Mitarbeiter'} />}
              {formikProps.values.id && <Field portal component={EmployeeSelector} name={'employee_id'} label={'Mitarbeiter'} />}
              <Field portal component={ProjectSelector} name={'project_id'} label={'Projekt'} />
              <Field portal formProps={formikProps} component={ProjectPositionSelector} name={'position_id'} label={'Aktivität'} />
              <Field component={DatePicker} name={'date'} label={'Datum'} fullWidth />
              <Field component={EffortValueField} name={'value'} label={'Wert'} fullWidth />
            </DialogContent>

            <DialogActions>
              <Button onClick={this.handleClose(formikProps)}>Abbruch</Button>
              <Button
                onClick={async () => {
                  await this.handleSubmit(formikProps.values, formikProps);
                  this.props.effortStore!.is_editing = false;
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
