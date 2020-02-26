import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import * as yup from 'yup';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeField } from '../../form/fields/formik';
import PercentageField from '../../form/fields/PercentageField';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import { MainStore } from '../../stores/mainStore';
import { ProjectStore } from '../../stores/projectStore';
import compose from '../../utilities/compose';
import { dimeDate, requiredNumber, selector } from '../../utilities/validation';
import { DateSpanPicker } from './DateSpanPicker';

interface Props {
  mainStore?: MainStore;
  projectStore?: ProjectStore;
}

interface State {
  loading: boolean;
}

const template = {
  from: moment().startOf('month'),
  to: moment().endOf('month'),
  project_id: null,
  daily_rate: 120000,
  vat: 0.077,
};

const schema = yup.object({
  from: dimeDate(),
  to: dimeDate(),
  project_id: selector(),
  daily_rate: requiredNumber(),
  vat: requiredNumber(),
});

@compose(
  inject('mainStore', 'projectStore'),
  observer,
)
export class ProjectReport extends React.Component<Props, State> {
  state = {
    loading: true,
  };

  async componentWillMount() {
    await this.props.projectStore!.fetchAll();
    this.setState({ loading: false });
  }

  render() {
    return (
      <>
        <DimeAppBar title={'Projektrapport'} />
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
                  <DimeField required component={ProjectSelect} name="project_id" label={'Projekt'} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DimeField component={CurrencyField} name={'daily_rate'} label={'Tagessatz'} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DimeField component={PercentageField} name={'vat'} label={'MwSt.'} />
                </Grid>
                <Grid item xs={12}>
                  <DownloadButton
                    href={() => this.props.mainStore!.apiV2URL('reports/project_report/' + formikProps.values.project_id, schema.cast(formikProps.values))}
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
