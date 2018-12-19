import * as React from 'react';
import { Fragment } from 'react';
import { Field, FieldArray, FormikProps } from 'formik';
import { SwitchField, TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { empty } from '../../utilities/helpers';
import { Service } from '../../types';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { RateUnitSelector } from '../../form/entitySelector/RateUnitSelector';
import { inject, Observer, observer } from 'mobx-react';
import { FormView, FormViewProps } from '../../form/FormView';
import compose from '../../utilities/compose';
import { RateGroupStore } from 'src/stores/rateGroupStore';
import CurrencyField from '../../form/fields/CurrencyField';
import PercentageField from '../../form/fields/PercentageField';
import TableToolbar from '../../layout/TableToolbar';
import { serviceSchema } from './serviceSchema';
import { DimePaper } from '../../layout/DimePaper';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ServiceRate } from '../../types';

export interface Props extends FormViewProps<Service> {
  rateUnitSelectDisabled: boolean;
  rateGroupStore?: RateGroupStore;
  rateUnitStore?: RateUnitStore;
  service: Service | undefined;
}

@compose(
  inject('rateGroupStore', 'rateUnitStore'),
  observer
)
export default class ServiceForm extends React.Component<Props> {
  public state = {
    loading: true,
  };

  public componentWillMount() {
    Promise.all([this.props.rateGroupStore!.fetchAll(), this.props.rateUnitStore!.fetchAll()]).then(() =>
      this.setState({ loading: false })
    );
  }

  public render() {
    const { service } = this.props;

    return (
      <FormView
        paper={false}
        loading={empty(service) || this.props.loading || this.state.loading}
        title={this.props.title}
        validationSchema={serviceSchema}
        initialValues={service}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(props: FormikProps<Service>) => (
          <Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={24}>
                <Grid item xs={12} lg={8}>
                  <DimePaper>
                    <Grid container spacing={24}>
                      <Grid item xs={12}>
                        <Field fullWidth component={TextField} name={'name'} label={'Name'} />
                      </Grid>
                      <Grid item xs={12}>
                        <Field component={TextField} name={'description'} label={'Beschreibung'} fullWidth />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <Field component={PercentageField} name={'vat'} label={'Mehrwertsteuer'} fullWidth />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <Grid item xs={12}>
                          <Field component={SwitchField} name={'chargeable'} label={'Verrechenbar'} fullWidth={true} />
                        </Grid>
                        <Grid item xs={12}>
                          <Field component={SwitchField} name={'archived'} label={'Archiviert'} fullWidth={true} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </DimePaper>
                </Grid>
                <Grid item xs={12} lg={8}>
                  <FieldArray
                    name="service_rates"
                    render={arrayHelpers => (
                      <Observer>
                        {() => (
                          <DimePaper>
                            <TableToolbar title={'Tarife'} numSelected={0} />
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <DimeTableCell style={{ width: '33%' }}>Tarifgruppe</DimeTableCell>
                                  <DimeTableCell style={{ width: '33%' }}>Einheit</DimeTableCell>
                                  <DimeTableCell style={{ width: '34%' }}>Wert</DimeTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {props.values.service_rates.map((r: ServiceRate, index: number) => {
                                  const rateGroupId = props.values.service_rates[index].rate_group_id;
                                  const rateGroup = this.props.rateGroupStore!.rateGroups.find(g => g.id === rateGroupId);
                                  return (
                                    <TableRow key={index}>
                                      <DimeTableCell>{rateGroup ? rateGroup.name : rateGroupId}</DimeTableCell>
                                      <DimeTableCell>
                                        <Field
                                          disabled={this.props.rateUnitSelectDisabled}
                                          component={RateUnitSelector}
                                          name={`service_rates.${index}.rate_unit_id`}
                                        />
                                      </DimeTableCell>
                                      <DimeTableCell>
                                        <Field component={CurrencyField} name={`service_rates.${index}.value`} unit={'CHF'} />
                                      </DimeTableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </DimePaper>
                        )}
                      </Observer>
                    )}
                  />
                </Grid>
              </Grid>
            </form>
          </Fragment>
        )}
      />
    );
  }
}
