import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import * as yup from 'yup';
import {EmployeeSelect} from '../../form/entitySelect/EmployeeSelect';
import { DimeField } from '../../form/fields/formik';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import {EmployeeStore} from '../../stores/employeeStore';
import { MainStore } from '../../stores/mainStore';
import compose from '../../utilities/compose';
import { dimeDate, requiredNumber, selector } from '../../utilities/validation';
import { DateSpanPicker } from './DateSpanPicker';

interface Props {
  mainStore?: MainStore;
  employeeStore?: EmployeeStore;
}

interface State {
  loading: boolean;
}

const template = {
  from: moment().startOf('month'),
  to: moment().endOf('month'),
  employee_ids: null,
};

const schema = yup.object({
  from: dimeDate(),
  to: dimeDate(),
  employee_ids: yup.array().of(yup.number()).typeError('Es muss mindestens ein Mitarbeiter ausgewählt sein.'),
});

@compose(
  inject('mainStore', 'employeeStore'),
  observer,
)
export class EmployeesReport extends React.Component<Props, State> {
  state = {
    loading: true,
  };

  async componentWillMount() {
    await this.props.employeeStore!.fetchAll();
    this.setState({ loading: false });
  }

  render() {
    return (
      <>
        <DimeAppBar title={'Mitarbeiterraport'} />
        <DimeContent loading={this.state.loading}>
          <Formik
            initialValues={template}
            onSubmit={() => {
              // do nothing, user clicks a GET link for the backend instead
            }}
            validationSchema={schema}
            render={formikProps => (
              <Grid container alignItems={'center'} spacing={24}>
                <Grid item xs={12} md={12}>
                  <DateSpanPicker
                    fromValue={formikProps.values.from}
                    onChangeFrom={v => formikProps.setFieldValue('from', v)}
                    toValue={formikProps.values.to}
                    onChangeTo={v => formikProps.setFieldValue('to', v)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DimeField isMulti required component={EmployeeSelect} name="employee_ids" label={'Mitarbeiter'} />
                </Grid>
                <Grid item xs={12}>
                  <DownloadButton
                    href={() => this.props.mainStore!.apiV2URL('reports/employees_report/', {
                        employee_ids: yup.array().of(yup.number()).cast(formikProps.values.employee_ids).join(','),
                        from: dimeDate().cast(formikProps.values.from),
                        to: dimeDate().cast(formikProps.values.to),
                      },
                    )}
                    disabled={!formikProps.isValid}
                  >
                    PDF Herunterladen
                  </DownloadButton>
                </Grid>
              </Grid>
            )}
          />
        </DimeContent>
      </>
    );
  }
}

interface DBProps {
  disabled?: boolean;
  href: () => string;
  children: React.ReactNode;
}

const DownloadButton = ({ disabled, href, children }: DBProps) => {
  const content = (
    <Button color={'primary'} variant="contained" disabled={disabled}>
      {children}
    </Button>
  );

  let computedHref;
  if (!disabled) {
    try {
      computedHref = href();
    } catch (e) {
      // the "valid" prop does not seem quite stable and sometimes flickers to true before it realizes the form is invalid
    }
  }

  return disabled || !computedHref ? (
    content
  ) : (
    <a href={computedHref} target={'_blank'} style={{ textDecoration: 'none', color: 'white' }}>
      {content}
    </a>
  );
};
