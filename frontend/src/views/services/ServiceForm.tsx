import Grid from '@material-ui/core/Grid/Grid';
import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { FieldArray, FormikProps } from 'formik';
import { inject, Observer, observer } from 'mobx-react';
import * as React from 'react';
import { RateGroupStore } from 'src/stores/rateGroupStore';
import { RateUnitSelect } from '../../form/entitySelect/RateUnitSelect';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeField } from '../../form/fields/formik';
import PercentageField from '../../form/fields/PercentageField';
import { FormView, FormViewProps } from '../../form/FormView';
import { DimePaper } from '../../layout/DimePaper';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { MarkdownRender } from '../../layout/MarkdownRender';
import TableToolbar from '../../layout/TableToolbar';
import { GlobalSettingStore } from '../../stores/globalSettingStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { Service, ServiceRate } from '../../types';
import compose from '../../utilities/compose';
import { empty } from '../../utilities/helpers';
import { serviceSchema } from './serviceSchema';

export interface Props extends FormViewProps<Service> {
  rateUnitSelectDisabled: boolean;
  rateGroupStore?: RateGroupStore;
  rateUnitStore?: RateUnitStore;
  globalSettingStore?: GlobalSettingStore;
  service: Service | undefined;
}

@compose(
  inject('rateGroupStore', 'rateUnitStore', 'globalSettingStore'),
  observer,
)
export default class ServiceForm extends React.Component<Props> {
  state = {
    loading: true,
  };

  componentDidMount() {
    Promise.all([
      this.props.rateGroupStore!.fetchAll(),
      this.props.rateUnitStore!.fetchAll(),
      this.props.globalSettingStore!.fetchOne(0),
    ]).then(() => this.setState({ loading: false }));
  }

  render() {
    const { service } = this.props;

    return (
      <FormView
        paper={false}
        loading={empty(service) || this.props.loading || this.state.loading}
        title={this.props.title}
        validationSchema={serviceSchema}
        initialValues={service!}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(props: FormikProps<Service>) => (
          <React.Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={6}>
                <Grid item xs={12} lg={8}>
                  <DimePaper>
                    <Grid container spacing={6}>
                      <Grid item xs={12}>
                        <DimeField required component={TextField} name={'name'} label={'Name'} />
                      </Grid>
                      <Grid item xs={12}>
                        <DimeField component={TextField} name={'description'} label={'Beschreibung'} />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <DimeField component={PercentageField} required name={'vat'} label={'Mehrwertsteuer'} />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <Grid item xs={12}>
                          {/*FIXME this field doesn't exist on the backend?*/}
                          <DimeField component={SwitchField} name={'chargeable'} label={'Verrechenbar'} />
                        </Grid>
                        <Grid item xs={12}>
                          <DimeField component={SwitchField} name={'archived'} label={'Archiviert'} fullWidth={true} />
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} lg={4}>
                            <DimeField component={NumberField} required name={'order'} label={'Reihenfolge'} />
                          </Grid>
                          <Grid item xs={12} lg={8}>
                            <MarkdownRender>{this.props.globalSettingStore!.settings!.service_order_comment}</MarkdownRender>
                          </Grid>
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
                                        <DimeField
                                          disabled={this.props.rateUnitSelectDisabled}
                                          component={RateUnitSelect}
                                          name={`service_rates.${index}.rate_unit_id`}
                                        />
                                      </DimeTableCell>
                                      <DimeTableCell>
                                        <DimeField component={CurrencyField} name={`service_rates.${index}.value`} />
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
          </React.Fragment>
        )}
      />
    );
  }
}
