import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { FieldArray, FormikProps } from 'formik';
import { inject, Observer, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { RateGroupStore } from 'src/stores/rateGroupStore';
import { ServiceCategoryStore } from 'src/stores/serviceCategoryStore';
import { ServiceStore } from 'src/stores/serviceStore';
import { RateUnitSelect } from '../../form/entitySelect/RateUnitSelect';
import { ServiceCategorySelect } from '../../form/entitySelect/ServiceCategorySelect';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeField } from '../../form/fields/formik';
import PercentageField, { VatField } from '../../form/fields/PercentageField';
import { FormView, FormViewProps } from '../../form/FormView';
import { DimePaper } from '../../layout/DimePaper';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { ExpandMoreIcon } from '../../layout/icons';
import TableToolbar from '../../layout/TableToolbar';
import { GlobalSettingStore } from '../../stores/globalSettingStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { Service, ServiceRate } from '../../types';
import compose from '../../utilities/compose';
import { empty } from '../../utilities/helpers';
import { wrapIntl } from '../../utilities/wrapIntl';
import { MarkdownAccordion } from './MarkdownAccordion';
import { serviceSchema } from './serviceSchema';

export interface Props extends FormViewProps<Service> {
  rateUnitSelectDisabled: boolean;
  rateGroupStore?: RateGroupStore;
  rateUnitStore?: RateUnitStore;
  serviceCategoryStore?: ServiceCategoryStore;
  serviceStore?: ServiceStore;
  globalSettingStore?: GlobalSettingStore;
  intl?: IntlShape;
  service: Service | undefined;
}

@compose(
  injectIntl,
  inject('rateGroupStore', 'rateUnitStore', 'globalSettingStore', 'serviceCategoryStore', 'serviceStore'),
  observer,
)
export default class ServiceForm extends React.Component<Props> {
  state = {
    loading: true,
  };

  componentWillMount() {
    Promise.all([
      this.props.rateGroupStore!.fetchAll(),
      this.props.rateUnitStore!.fetchAll(),
      this.props.serviceCategoryStore!.fetchAll(),
      this.props.serviceStore!.fetchAll(),
      this.props.globalSettingStore!.fetchOne(0),
    ]).then(() => this.setState({ loading: false }));
  }

  computeOrder(props: FormikProps<Service>) {
    const groupNumber = this.props.serviceCategoryStore!.entities
      .find(e => e.id === props.values.service_category_id)?.order || 0;
    return groupNumber * 100 + props.values.local_order;
  }

  render() {
    const idPrefix = 'view.service.form';
    const intlText = wrapIntl(this.props.intl!, idPrefix);
    const service = this.props.service ?? {
      id: undefined,
      name: '',
      description: '',
      vat: 0,
      chargeable: false,
      archived: false,
      service_rates: [],
      order: 0,
    };
    const otherServicesInCategory = (category: number | null) => this.props.serviceStore!.entities
      .filter(e => e.service_category_id === category)
      .filter(e => e.id !== service.id)
      .sort((e, f) => e.order - f.order);

    return (
      <FormView
        intl={this.props.intl!}
        paper={false}
        loading={empty(service) || this.props.loading || this.state.loading}
        title={this.props.title}
        validationSchema={serviceSchema}
        initialValues={service}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(props: FormikProps<Service>) => (
          <React.Fragment>
            <form onSubmit={props.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <DimePaper>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <DimeField required component={TextField} name={'name'} label={intlText('general.name', true)} />
                      </Grid>
                      <Grid item xs={12}>
                        <DimeField component={TextField} name={'description'} label={intlText('general.description', true)} />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <DimeField component={VatField} required name={'vat'} label={intlText('value_added_tax')} />
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <Grid item xs={12}>
                          {/*FIXME this field doesn't exist on the backend?
                          <DimeField component={SwitchField} name={'chargeable'} label={intlText('chargeable')} />
                          */}
                        </Grid>
                        <Grid item xs={12}>
                          <DimeField component={SwitchField} name={'archived'} label={intlText('archived')} fullWidth={true} />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <DimeField component={ServiceCategorySelect} mode="grouped" nullable required name={'service_category_id'} label={intlText('service_category')} />
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <DimeField component={NumberField} required name={'local_order'} label={intlText('service_number')} />
                      </Grid>
                      <Grid item xs={12} lg={4}>
                        <NumberField disabled value={this.computeOrder(props)} label={intlText('computed_order')} onChange={() => undefined} />
                      </Grid>
                      <Grid item xs={12}>
                        <List subheader={<ListSubheader>{intlText('similar_services')}</ListSubheader>}>
                          {otherServicesInCategory(props.values.service_category_id).map(e =>
                            <ListItem key={e.id}>
                              <ListItemText
                                primary={e.order + ' ' + e.name}
                              />
                            </ListItem>,
                          )}
                        </List>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} lg={4}>
                            <DimeField component={NumberField} required name={'order'} label={intlText('sorting_order')} />
                          </Grid>
                          <Grid item xs={12} lg={8} container direction="column" justifyContent="center">
                            <MarkdownAccordion title={intlText('sorting_order_details')} globalSettingStore={this.props.globalSettingStore} />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </DimePaper>
                </Grid>
                <Grid item xs={12}>
                  <FieldArray
                    name="service_rates"
                    render={arrayHelpers => (
                      <Observer>
                        {() => (
                          <DimePaper>
                            <TableToolbar title={intlText('general.rate.plural', true)} numSelected={0} />
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <DimeTableCell style={{ width: '33%' }}> <FormattedMessage id="general.rate_group" /> </DimeTableCell>
                                  <DimeTableCell style={{ width: '33%' }}> <FormattedMessage id={idPrefix + '.unit'} /></DimeTableCell>
                                  <DimeTableCell style={{ width: '34%' }}> <FormattedMessage id="general.value" /> </DimeTableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {props.values.service_rates.map((r: ServiceRate, index: number) => {
                                  const rateGroupId = props.values.service_rates[index].rate_group_id;
                                  const rateGroup = this.props.rateGroupStore!.entities.find(g => g.id === rateGroupId);
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
