import {TableBody} from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {ArrayHelpers, FieldArray, Formik, FormikProps} from 'formik';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import * as yup from 'yup';
import {EmployeeSelect} from '../../form/entitySelect/EmployeeSelect';
import { ProjectSelect } from '../../form/entitySelect/ProjectSelect';
import {TextField} from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeField } from '../../form/fields/formik';
import PercentageField, { VatField } from '../../form/fields/PercentageField';
import {FormikSubmitDetector} from '../../form/FormikSubmitDetector';
import {ConfirmationButton} from '../../layout/ConfirmationDialog';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent } from '../../layout/DimeContent';
import {DimeTableCell} from '../../layout/DimeTableCell';
import TableToolbar from '../../layout/TableToolbar';
import {EmployeeStore} from '../../stores/employeeStore';
import { MainStore } from '../../stores/mainStore';
import { ProjectStore } from '../../stores/projectStore';
import compose from '../../utilities/compose';
import { dimeDate, requiredNumber, selector } from '../../utilities/validation';
import { wrapIntl } from '../../utilities/wrapIntl';
import { DateSpanPicker } from './DateSpanPicker';

interface Props {
  mainStore?: MainStore;
  projectStore?: ProjectStore;
  employeeStore?: EmployeeStore;
  intl?: IntlShape;
}

interface State {
  loading: boolean;
}

const costTemplate = () => ({
  name: '',
  cost: 0,
  formikKey: Math.random(),
});

const template = () => ({
  from: moment().startOf('month'),
  to: moment().endOf('month'),
  project_id: null,
  exclude_employee_ids: null,
  vat: 0.077,
  additional_costs: [],
});

const additionalCostSchema = yup.object({
  name: yup.string(),
  cost: requiredNumber(),
  formikKey: requiredNumber(),
});

const schema = yup.object({
  from: dimeDate(),
  to: dimeDate(),
  project_id: selector(),
  exclude_employee_ids: yup.array().of(selector()).nullable(true),
  vat: requiredNumber(),
  additional_costs: yup.array().of(additionalCostSchema),
});

@compose(
  injectIntl,
  inject('mainStore', 'projectStore', 'employeeStore'),
  observer,
)
export class ProjectReport extends React.Component<Props, State> {
  state = {
    loading: true,
  };

  componentDidMount() {
    Promise.all([
      this.props.projectStore!.fetchAll(),
      this.props.employeeStore!.fetchAll(),
    ]).then(() => this.setState({ loading: false }));
  }

  handleAdd(arrayHelpers: ArrayHelpers) {
    arrayHelpers.push(costTemplate());
  }

  handleRemove(arrayHelpers: ArrayHelpers, index: number, formikProps: FormikProps<any>) {
    arrayHelpers.pop();

    for (let i = 0; i < formikProps.values.additional_costs.length; i++) {
      if (i < index) {
        // tslint:disable-next-line:no-console
        console.log(formikProps.values.additional_costs[i]);
        const fieldName = `additional_costs.${i}.name`;
        const fieldCost = `additional_costs.${i}.cost`;
        const name = formikProps.values.additional_costs[i].name;
        const cost = formikProps.values.additional_costs[i].cost;

        formikProps.setFieldValue(fieldName, name);
        formikProps.setFieldValue(fieldCost, cost);
      } else if (i > index) {
        // tslint:disable-next-line:no-console
        console.log(formikProps.values.additional_costs[i]);
        const fieldName = `additional_costs.${i - 1}.name`;
        const fieldCost = `additional_costs.${i - 1}.cost`;
        const name = formikProps.values.additional_costs[i].name;
        const cost = formikProps.values.additional_costs[i].cost;

        formikProps.setFieldValue(fieldName, name);
        formikProps.setFieldValue(fieldCost, cost);
      }
    }
  }

  render() {
    const handleAdd = this.handleAdd;
    const handleRemove = this.handleRemove;
    const idPrefix = 'view.report.project';
    const intlText = wrapIntl(this.props.intl!, idPrefix);

    return (
      <>
        <DimeAppBar title={intlText('layout.navigation.reports.project', true)} />
        <DimeContent loading={this.state.loading}>
          <Formik
            initialValues={template()}
            enableReinitialize
            onSubmit={() => {
              // do nothing, user clicks a GET link for the backend instead
            }}
            validationSchema={schema}
          >
            {formikProps => {
              const values = formikProps.values;
              return (
                <FormikSubmitDetector {...formikProps}>
                  <Grid container alignItems={'center'} spacing={3}>
                    <Grid item xs={12} md={10} lg={10}>
                      <DateSpanPicker
                        fromValue={formikProps.values.from}
                        onChangeFrom={v => formikProps.setFieldValue('from', v)}
                        toValue={formikProps.values.to}
                        onChangeTo={v => formikProps.setFieldValue('to', v)}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <DimeField required component={ProjectSelect} name="project_id" label={intlText('general.project', true)} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <DimeField isMulti component={EmployeeSelect} name="exclude_employee_ids" label={intlText('excluded_employees')} />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <DimeField component={VatField} name={'vat'} label={intlText('general.vat', true)} />
                    </Grid>
                  </Grid>

                  <FieldArray
                    name="additional_costs"
                    render={(arrayHelpers: any) => (
                      <>
                        <TableToolbar title={intlText('additional_costs')} addAction={() => handleAdd(arrayHelpers)} style={{paddingLeft: '0px'}}/>
                        <div style={{ padding: '0px 15px 20px 0px' }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <DimeTableCell style={{ width: '80%' }}> <FormattedMessage id={idPrefix + '.description'} /> </DimeTableCell>
                                <DimeTableCell style={{ width: '15%' }}> <FormattedMessage id={idPrefix + '.price'} /> </DimeTableCell>
                                <DimeTableCell style={{ width: '5%' }}> <FormattedMessage id={'general.actions'} /> </DimeTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {arrayHelpers.form.values.additional_costs.map((cost: any, index: any) => {
                                return (
                                  <TableRow key={index}>
                                    <DimeTableCell>
                                      <DimeField delayed component={TextField} name={`additional_costs.${index}.name`} margin={'none'} />
                                    </DimeTableCell>
                                    <DimeTableCell>
                                      <DimeField delayed component={CurrencyField} name={`additional_costs.${index}.cost`} margin={'none'} />
                                    </DimeTableCell>
                                    <DimeTableCell>
                                      <ConfirmationButton
                                        onConfirm={() => handleRemove(arrayHelpers, index, formikProps)}
                                      />
                                    </DimeTableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      </>
                    )}
                  />

                  <Grid>
                    <Grid item xs={12}>
                      <DownloadButton
                        href={() => {
                          return this.props.mainStore!.apiV2URL('reports/project_report/' + formikProps.values.project_id, {
                            additional_costs_names: yup.array().of(additionalCostSchema).cast(formikProps.values.additional_costs)?.map((value: any) => {
                              return value.name;
                            }).join(','),
                            additional_costs_prices: yup.array().of(additionalCostSchema).cast(formikProps.values.additional_costs)?.map((value: any) => {
                              return value.cost.toString();
                            }).join(','),
                            exclude_employee_ids: yup.array().of(selector()).cast(formikProps.values.exclude_employee_ids || [])?.map((value: any) => {
                              return value.toString();
                            }).join(','),
                            from: dimeDate().cast(formikProps.values.from),
                            to: dimeDate().cast(formikProps.values.to),
                            project_id: selector().cast(formikProps.values.project_id),
                            vat: requiredNumber().cast(formikProps.values.vat),
                          });
                        }
                        }
                        disabled={!formikProps.isValid}
                      >
                        <FormattedMessage id="general.action.download" />
                      </DownloadButton>
                    </Grid>
                  </Grid>
                </FormikSubmitDetector>
              );
              }
            }
          </Formik>
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
