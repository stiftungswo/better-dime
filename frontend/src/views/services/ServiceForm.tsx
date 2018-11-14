import * as React from 'react';
import { Fragment } from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import * as yup from 'yup';
import { Field, FieldArray, FormikProps } from 'formik';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import Grid from '@material-ui/core/Grid/Grid';
import { hasContent } from '../../layout/DimeLayout';
import { Service, ServiceRate } from './types';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { RateUnitSelector } from '../../form/entitySelector/RateUnitSelector';
import { inject, observer } from 'mobx-react';
import { FormView, FormViewProps } from '../../form/FormView';
import compose from '../../utilities/compose';
import { ServiceStore } from 'src/stores/serviceStore';

export interface Props extends FormViewProps<Service> {
  serviceStore: ServiceStore;
  service: Service | undefined;
}

const schema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  vat: yup.number().required(),
  chargeable: yup.boolean(),
  archived: yup.boolean(),
  service_rates: yup.array(
    yup.object({
      id: yup.number(),
      rate_group_id: yup.number().required(),
      rate_unit_id: yup.number().required(),
      value: yup.number().required(),
    })
  ),
});

@compose(
  inject('serviceStore'),
  observer
)
export default class ServiceForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.serviceStore!.fetchAll();
  }

  public rateGroupName(id: number) {
    const service = this.props.serviceStore!.services.find(g => g.id === id);
    return service ? service.name : id;
  }

  public render() {
    const { service } = this.props;

    return (
      <FormView
        loading={!hasContent(service) || this.props.loading}
        title={this.props.title}
        validationSchema={schema}
        initialValues={service}
        onSubmit={this.props.onSubmit}
        submitted={this.props.submitted}
        render={(
          props: FormikProps<any> // tslint:disable-line
        ) => (
          <Fragment>
            <Typography component="h4" variant="h5" align={'left'}>
              Allgemeine Informationen
            </Typography>
            <form onSubmit={props.handleSubmit}>
              <Grid container={true}>
                <Grid item={true} xs={12}>
                  <Field component={TextField} name={'name'} label={'Name'} fullWidth />
                </Grid>
              </Grid>

              <Grid container={true}>
                <Grid item={true} xs={12}>
                  <Field component={TextField} name={'description'} label={'Beschreibung'} fullWidth />
                </Grid>
              </Grid>

              <Grid container={true}>
                <Grid item={true} xs={12}>
                  {/*TODO custom input*/}
                  <Field component={NumberField} name={'vat'} label={'Mehrwertsteuer'} fullWidth />
                </Grid>
              </Grid>

              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <Field component={SwitchField} name={'chargeable'} label={'Verrechenbar'} fullWidth={true} />
                </Grid>
                <Grid item={true} xs={12}>
                  <Field component={SwitchField} name={'archived'} label={'Archiviert'} fullWidth={true} />
                </Grid>
              </Grid>

              {/*~~~~~~~~~~~~~*/}

              <Typography component="h4" variant="h5" align={'left'}>
                Tarife
              </Typography>
              <FieldArray
                name="service_rates"
                render={arrayHelpers => (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tarifgruppe</TableCell>
                        <TableCell>Einheit</TableCell>
                        <TableCell>Wert</TableCell>
                        {/*<TableCell>Aktionen</TableCell>*/}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.values.service_rates.map((r: ServiceRate, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{this.rateGroupName(props.values.service_rates[index].rate_group_id)}</TableCell>
                          <TableCell>
                            <Field component={RateUnitSelector} name={`service_rates.${index}.rate_unit_id`} />
                          </TableCell>
                          <TableCell>
                            {/*TODO adornment should use configured app curency */}
                            <Field component={NumberField} name={`service_rates.${index}.value`} unit={'CHF'} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              />
            </form>
          </Fragment>
        )}
      />
    );
  }
}
