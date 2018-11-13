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
          <Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={24}>
                <Grid item xs={12}>
                  {/*TODO link invoices*/}
                  {project && <Navigator offers={project.offer_id ? [project.offer_id] : []} invoices={[]} id={project.id} />}
                  <DimePaper>
                    <FormControl half>
                      <Field fullWidth component={TextField} name={'name'} label={'Name'} />
                    </FormControl>
                    <FormControl half>
                      <Field fullWidth component={AddressSelector} name={'address_id'} label={'Kunde'} />
                    </FormControl>
                    <FormControl half>
                      <Field component={EmployeeSelector} name={'accountant_id'} label={'Verantwortlicher Mitarbeiter'} />
                    </FormControl>
                    <FormControl half>
                      <Field component={SwitchField} name={'chargeable'} label={'Verrechenbar'} />
                    </FormControl>
                    <FormControl half>
                      <Field component={SwitchField} name={'archived'} label={'Archiviert'} />
                    </FormControl>
                    <FormControl half>
                      <Field fullWidth component={RateGroupSelector} name={'rate_group_id'} label={'Tarif'} />
                    </FormControl>
                    <FormControl half>
                      <Field fullWidth component={TodoField} name={'category_id'} label={'Tätigkeitsbereich'} />
                    </FormControl>
                    <FormControl half>
                      {/*TODO: make this properly nullable*/}
                      {/*TODO: why doesn't this display validation errors? */}
                      <Field fullWidth component={DatePicker} name={'deadline'} label={'Deadline'} />
                    </FormControl>
                    <FormControl>
                      <Field fullWidth component={TextField} multiline rowsMax={14} name={'description'} label={'Beschreibung'} />
                    </FormControl>
                    {project && (
                      <>
                        {/*TODO: format me nicely, maybe with those disabled outlined fields?*/}
                        <p>
                          <b>Verbleibende Kosten</b>: {mainStore!.formatCurrency(project.current_price)}/
                          {mainStore!.formatCurrency(project.budget_price)}
                        </p>
                        <p>
                          <b>Verbleibende Zeit</b>: {mainStore!.formatDuration(project.current_time)}/
                          {mainStore!.formatDuration(project.budget_time)}
                        </p>
                      </>
                    )}
                    <FormControl>
                      {/*TODO: make this properly nullable*/}
                      <Field fullWidth component={CurrencyField} name={'fixed_price'} label={'Fixpreis'} />
                    </FormControl>
                  </DimePaper>
                </Grid>

                <Grid item xs={12}>
                  <DimePaper>
                    {/*<ProjectPositionSubform formikProps={props} mainStore={this.props.mainStore} name={'positions'} />*/}
                  </DimePaper>
                </Grid>

                <Grid item xs={12} lg={6}>
                  <DimePaper>{/*<ProjectDiscountSubform formikProps={props} name={'discounts'} />*/}</DimePaper>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <DimePaper>
                    {/*<FormHeader>Berechnung</FormHeader>*/}
                    {/*<BreakdownLine title={'Subtotal'} value={project!.breakdown.subtotal} />*/}
                    {/*<BreakdownLine title={'Davon MwSt.'} value={project!.breakdown.vatTotal} />*/}
                    {/*<BreakdownLine title={'Total Abzüge'} value={project!.breakdown.discountTotal} />*/}
                    {/*<BreakdownLine title={'Total'} value={project!.breakdown.total} />*/}
                    {/*<Field component={CurrencyField} name={'fixed_price'} label={'Fixpreis'} />*/}
                  </DimePaper>
                </Grid>
              </Grid>
            </form>
          </Fragment>
        )}
      />
    );
  }
}
