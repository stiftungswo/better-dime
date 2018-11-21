import React from 'react';
import { Field, FormikBag } from 'formik';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { ProjectSelector } from '../../form/entitySelector/ProjectSelector';
import { DatePicker } from '../../form/fields/DatePicker';
import { FormDialog } from '../../form/FormDialog';
import { EffortStore } from '../../stores/effortStore';
import * as yup from 'yup';
import { ProjectEffort } from '../../types';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../../stores/mainStore';
import { ProjectPositionSelector } from '../../form/entitySelector/ProjectPositionSelector';
import { EffortValueField } from '../../form/fields/timetrack/EffortValueField';

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
  observer
)
export class TimetrackFormDialog extends React.Component<Props> {
  public handleSubmit = (entity: ProjectEffort, formikBag: FormikBag<any, any>) => {
    if (this.props.effortStore!.entity) {
      this.props.effortStore!.put(entity).then(() => (this.props.effortStore!.is_editing = false));
    } else {
      this.props.effortStore!.post(entity).then(() => (this.props.effortStore!.is_editing = false));
    }
  };

  public render() {
    return (
      <FormDialog
        open
        onClose={this.props.onClose}
        title={'Zeit erfassen'}
        initialValues={this.props.effortStore!.effort || this.props.effortStore!.effortTemplate!}
        validationSchema={schema}
        onSubmit={this.handleSubmit as any}
        render={(formikProps: any) => (
          <>
            <Field portal component={EmployeeSelector} name={'employee_id'} label={'Mitarbeiter'} />
            <Field portal component={ProjectSelector} name={'project_id'} label={'Projekt'} />
            <Field portal formProps={formikProps} component={ProjectPositionSelector} name={'position_id'} label={'Aktivität'} />
            <Field component={DatePicker} name={'date'} label={'Datum'} fullWidth />
            <Field component={EffortValueField} name={'value'} label={'Wert'} fullWidth />
          </>
        )}
      />
    );
  }
}
