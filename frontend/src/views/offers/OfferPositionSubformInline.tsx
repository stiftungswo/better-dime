import * as React from 'react';
import { ArrayHelpers, Field, FieldArray, FormikProps } from 'formik';
import { NumberField } from '../../form/fields/common';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { inject, Observer, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Offer, OfferPosition } from '../../types';
import { ServiceSelector } from '../../form/entitySelector/ServiceSelector';
import { MainStore } from '../../stores/mainStore';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import TableToolbar from '../../layout/TableToolbar';
import PercentageField from '../../form/fields/PercentageField';
import { RateUnitSelector } from '../../form/entitySelector/RateUnitSelector';
import CurrencyField from '../../form/fields/CurrencyField';
import { Service } from '../services/types';
import { ServiceSelectDialog } from '../../form/ServiceSelectDialog';
import { ServiceStore } from '../../stores/serviceStore';

export interface Props {
  mainStore?: MainStore;
  serviceStore?: ServiceStore;
  formikProps: FormikProps<Offer>;
  name: string;
  disabled?: boolean;
}

@compose(
  inject('mainStore', 'serviceStore'),
  observer
)
export default class OfferPositionSubformInline extends React.Component<Props> {
  state = {
    dialogOpen: false,
  };

  public componentWillMount() {
    this.props.serviceStore!.fetchAll();
  }

  public handleAdd = (arrayHelpers: ArrayHelpers) => (service: Service) => {
    const rate = service.service_rates.find(r => r.rate_group_id === this.props.formikProps.values.rate_group_id);
    if (!rate) {
      throw new Error('no rate was found');
    }
    arrayHelpers.push({
      amount: '',
      order: 100,
      vat: service.vat,
      service_id: service.id,
      rate_unit_id: rate.rate_unit_id,
      price_per_rate: rate.value,
    });
  };

  public render() {
    const { values } = this.props.formikProps;
    const { disabled } = this.props;
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <Observer>
            {() => (
              <>
                <TableToolbar
                  title={'Services'}
                  numSelected={0}
                  addAction={disabled ? undefined : () => this.setState({ dialogOpen: true })}
                />
                <div style={{ overflowX: 'auto' }}>
                  <Table padding={'dense'} style={{ minWidth: '1200px' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: '5%' }}>Sort.</TableCell>
                        <TableCell style={{ width: '25%' }}>Service</TableCell>
                        <TableCell style={{ width: '15%' }}>Tarif</TableCell>
                        <TableCell style={{ width: '20%' }}>Tariftyp</TableCell>
                        <TableCell style={{ width: '10%' }}>Menge</TableCell>
                        <TableCell style={{ width: '10%' }}>MwSt.</TableCell>
                        <TableCell style={{ width: '10%' }}>Total CHF</TableCell>
                        <TableCell style={{ width: '10%' }}>Aktionen</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.positions.map((p: OfferPosition, index: number) => {
                        const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                        const total = p.amount * p.price_per_rate * (1 + p.vat);
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Field
                                delayed
                                component={NumberField}
                                name={`positions.${index}.order`}
                                margin={'none'}
                                disabled={disabled}
                              />
                            </TableCell>
                            <TableCell>{this.props.serviceStore!.getName(values.positions[index].service_id)}</TableCell>
                            <TableCell>
                              <Field delayed component={CurrencyField} name={name('price_per_rate')} margin={'none'} disabled={disabled} />
                            </TableCell>
                            <TableCell>
                              <Field portal component={RateUnitSelector} name={name('rate_unit_id')} margin={'none'} disabled={disabled} />
                            </TableCell>
                            <TableCell>
                              <Field delayed component={NumberField} name={name('amount')} margin={'none'} disabled={disabled} />
                            </TableCell>
                            <TableCell>
                              <Field delayed component={PercentageField} name={name('vat')} margin={'none'} disabled={disabled} />
                            </TableCell>
                            <TableCell>{this.props.mainStore!.formatCurrency(total, false)}</TableCell>
                            <TableCell>
                              <DeleteButton onConfirm={() => arrayHelpers.remove(index)} disabled={disabled} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                {this.state.dialogOpen && (
                  <ServiceSelectDialog open onClose={() => this.setState({ dialogOpen: false })} onSubmit={this.handleAdd(arrayHelpers)} />
                )}
              </>
            )}
          </Observer>
        )}
      />
    );
  }
}
