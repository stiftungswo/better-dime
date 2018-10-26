import * as React from 'react';
import { Fragment } from 'react';
import Typography from '@material-ui/core/Typography/Typography';
import * as yup from 'yup';
import { Field, FieldArray, FormikProps } from 'formik';
import { EditForm, NumberFieldWithValidation, SwitchField, TextFieldWithValidation } from '../form/common';
import Grid from '@material-ui/core/Grid/Grid';
import { Loading } from '../utilities/DimeLayout';
import { Service, ServiceRate } from './types';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { RateUnitSelector } from '../form/RateUnitSelector';
import { inject, observer } from 'mobx-react';
import { RateGroupStore } from '../store/rateGroupStore';
import { RateUnitStore } from '../store/rateUnitStore';

export interface Props {
  rateGroupStore?: RateGroupStore;
  rateUnitStore?: RateUnitStore;
  handleSubmit: ((service: Service) => Promise<any>); // tslint:disable-line
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
      service_id: yup.number().required(),
      rate_unit_id: yup.number().required(),
      value: yup.number().required(),
    })
  ),
});

@inject('rateGroupStore')
@observer
export default class ServiceForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.rateGroupStore!.fetchAll();
  }

  public rateGroupName(id: number) {
    const group = this.props.rateGroupStore!.rateGroups.find(g => g.id === id);
    return group ? group.name : id;
  }

  public render() {
    const { service } = this.props;

    return (
      <Loading entity={service}>
        <EditForm
          header={'Service Bearbeiten'}
          validationSchema={schema}
          initialValues={{ ...service, password: '', password_repeat: '' }}
          onSubmit={this.props.handleSubmit}
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
                    <Field component={TextFieldWithValidation} name={'name'} label={'Name'} fullWidth />
                  </Grid>
                </Grid>

                <Grid container={true}>
                  <Grid item={true} xs={12}>
                    <Field component={TextFieldWithValidation} name={'description'} label={'Beschreibung'} fullWidth />
                  </Grid>
                </Grid>

                <Grid container={true}>
                  <Grid item={true} xs={12}>
                    {/*TODO custom input*/}
                    <Field component={NumberFieldWithValidation} name={'vat'} label={'Mehrwertsteuer'} fullWidth />
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
                            {/*TODO resolve name; implementation is somewhat related to #2 */}
                            <TableCell>{this.rateGroupName(props.values.service_rates[index].rate_group_id)}</TableCell>
                            <TableCell>
                              <Field component={RateUnitSelector} name={`service_rates.${index}.rate_unit_id`} />
                            </TableCell>
                            <TableCell>
                              {/*TODO add adornment based on rate unit; */}
                              <Field component={NumberFieldWithValidation} name={`service_rates.${index}.value`} unit={'CHF'} />
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
      </Loading>
    );
  }
}
