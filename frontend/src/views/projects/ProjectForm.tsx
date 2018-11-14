import * as React from 'react';
import { Fragment } from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import * as yup from 'yup';
import { Field, FormikProps } from 'formik';
import { SwitchField, TextField, TodoField } from '../../form/fields/common';
import Grid, { GridSize } from '@material-ui/core/Grid/Grid';
import { DimePaper, hasContent } from '../../layout/DimeLayout';
import { inject, observer } from 'mobx-react';
import { FormView, FormViewProps } from '../../form/FormView';
import compose from '../../utilities/compose';
import { Project } from '../../types';
import { EmployeeSelector } from '../../form/entitySelector/EmployeeSelector';
import { MainStore } from '../../stores/mainStore';
import { AddressSelector } from '../../form/entitySelector/AddressSelector';
import { StatusSelector } from '../../form/entitySelector/StatusSelector';
import { RateGroupSelector } from '../../form/entitySelector/RateGroupSelector';
import Tabs from '@material-ui/core/Tabs/Tabs';
import Tab from '@material-ui/core/Tab/Tab';
import { RouteComponentProps, withRouter } from 'react-router';
import { MarkdownField } from '../../form/fields/MarkdownField';
import CurrencyField from '../../form/fields/CurrencyField';
import { DatePicker } from '../../form/fields/DatePicker';
import MuiTextField from '@material-ui/core/TextField';
import MuiFormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import ProjectPositionSubform from './ProjectPositionSubform';

interface InfoFieldProps {
  value: string;
  label: string;
  unit?: string;
  error?: boolean;
  fullWidth?: boolean;
}

const InfoField = ({ value, label, unit, error, fullWidth = true }: InfoFieldProps) => (
  <MuiFormControl margin={'normal'} error={error} fullWidth={fullWidth}>
    <MuiTextField
      disabled
      variant={'outlined'}
      value={value}
      label={label}
      InputProps={{
        endAdornment: unit ? <InputAdornment position={'end'}>{unit}</InputAdornment> : undefined,
      }}
      InputLabelProps={{
        shrink: true,
        error,
      }}
    />
  </MuiFormControl>
);

interface FormControlProps {
  half?: boolean;
  children: React.ReactNode;
}

// FIXME i think i'm using way too much grid here. Can this be simplified?
const FormControl = ({ half = false, children }: FormControlProps) => {
  let lg: GridSize = 12;
  if (half) {
    lg = 6;
  }
  return (
    <Grid container={true}>
      <Grid item={true} xs={12} lg={lg}>
        {children}
      </Grid>
    </Grid>
  );
};

interface NavigatorProps extends RouteComponentProps {
  offers: number[];
  invoices: number[];
  id?: number;
}

const Navigator = withRouter(({ offers, invoices, id, history }: NavigatorProps) => (
  <Tabs value={offers.length}>
    {offers.map(pId => (
      <Tab key={pId} onClick={() => history.push(`/projects/${pId}`)} label={`Offerte ${pId}`} />
    ))}
    <Tab label={`Projekt ${id}`} />
    {invoices.map(pId => (
      <Tab key={pId} onClick={() => history.push(`/invoices/${pId}`)} label={`Rechnung ${pId}`} />
    ))}
  </Tabs>
));

const schema = yup.object({
  name: yup.string().required(),
  accountant_id: yup.number().required(),
  address_id: yup.number().required(),
  description: yup.string(),
  chargeable: yup.boolean(),
  archived: yup.boolean(),
  status: yup.number().required(),
  deadline: yup.date(),
  category_id: yup.number().required(),
  rate_group_id: yup.number().required(),
  fixed_price: yup.number(),
  positions: yup.array(
    yup.object({
      description: yup.string(),
      price_per_rate: yup.number().required(),
      rate_unit_id: yup.number().required(),
    })
  ),
});

export interface Props extends FormViewProps<Project> {
  mainStore?: MainStore;
  project?: Project;
}

@compose(
  inject('mainStore'),
  observer
)
export default class ProjectForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const { project, mainStore } = this.props;

    return (
      <FormView
        paper={false}
        loading={!hasContent(project) || this.props.loading}
        title={this.props.title}
        validationSchema={schema}
        initialValues={project}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(
          props: FormikProps<any> // tslint:disable-line
        ) => (
          <form onSubmit={props.handleSubmit}>
            <Grid container spacing={24}>
              <Grid item xs={12} lg={10} xl={8}>
                {/*TODO link invoices*/}
                {project && <Navigator offers={project.offer_id ? [project.offer_id] : []} invoices={[]} id={project.id} />}
                <DimePaper>
                  <Grid container spacing={24}>
                    <Grid item xs={12}>
                      <Field fullWidth component={TextField} name={'name'} label={'Name'} />
                    </Grid>
                    <Grid item xs={12} lg={8}>
                      <Field fullWidth component={AddressSelector} name={'address_id'} label={'Kunde'} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Field fullWidth component={RateGroupSelector} name={'rate_group_id'} label={'Tarif'} />
                    </Grid>

                    <Grid item xs={12} lg={8}>
                      <Field component={EmployeeSelector} name={'accountant_id'} label={'Verantwortlicher Mitarbeiter'} />
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Field fullWidth component={TodoField} name={'category_id'} label={'Tätigkeitsbereich'} />
                    </Grid>
                    <Grid item xs={12}>
                      {/*TODO: make this properly nullable*/}
                      {/*TODO: why doesn't this display validation errors? */}
                      <Field fullWidth component={DatePicker} name={'deadline'} label={'Deadline'} />
                    </Grid>
                    <Grid item xs={12}>
                      <Field fullWidth component={TextField} multiline rowsMax={14} name={'description'} label={'Beschreibung'} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      {/*TODO: make this properly nullable*/}
                      <Field fullWidth component={CurrencyField} name={'fixed_price'} label={'Fixpreis'} />
                    </Grid>
                    <Grid item xs={12}>
                      <Field component={SwitchField} name={'chargeable'} label={'Verrechenbar'} />
                    </Grid>
                    <Grid item xs={12}>
                      <Field component={SwitchField} name={'archived'} label={'Archiviert'} />
                    </Grid>
                    {project && (
                      <>
                        <Grid item xs={12} lg={6}>
                          <InfoField
                            fullWidth
                            label={'Verbleibendes Budget'}
                            value={`${mainStore!.formatCurrency(project.current_price, false)} / ${mainStore!.formatCurrency(
                              project.budget_price,
                              false
                            )}`}
                            error={project.current_price > project.budget_price}
                            unit={'CHF'}
                          />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <InfoField
                            fullWidth
                            label={'Verbleibende Zeit'}
                            value={`${mainStore!.formatDuration(project.current_time, 'h', false)} / ${mainStore!.formatDuration(
                              project.budget_time,
                              'h',
                              false
                            )}`}
                            error={project.current_time > project.budget_time}
                            unit={'h'}
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </DimePaper>
              </Grid>

              <Grid item xs={12}>
                <DimePaper>
                  <ProjectPositionSubform formikProps={props} mainStore={this.props.mainStore} name={'positions'} />
                </DimePaper>
              </Grid>
            </Grid>
          </form>
        )}
      />
    );
  }
}
