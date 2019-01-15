import * as React from 'react';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import { NumberField, TextField } from '../../form/fields/common';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { inject, Observer, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Offer, OfferPosition, Service } from '../../types';
import { MainStore } from '../../stores/mainStore';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import TableToolbar from '../../layout/TableToolbar';
import PercentageField from '../../form/fields/PercentageField';
import { RateUnitSelector } from '../../form/entitySelector/RateUnitSelector';
import CurrencyField from '../../form/fields/CurrencyField';
import { ServiceSelectDialog } from '../../form/ServiceSelectDialog';
import { ServiceStore } from '../../stores/serviceStore';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { Typography } from '@material-ui/core';
import { DraggableTableBody } from '../invoices/DraggableTableBody';
import { DragHandle } from '../../layout/icons';
import { getInsertionIndex } from '../../utilities/getInsertionIndex';
import { DimeField } from '../../form/fields/formik';

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

  public handleAdd = (arrayHelpers: ArrayHelpers) => (service: Service) => {
    const rate = service.service_rates.find(r => r.rate_group_id === this.props.formikProps.values.rate_group_id);
    if (!rate) {
      throw new Error('no rate was found');
    }

    const insertIndex = getInsertionIndex(this.props.formikProps.values.positions.map(p => p.order), service.order, (a, b) => a - b);
    arrayHelpers.insert(insertIndex, {
      amount: '',
      order: service.order,
      vat: service.vat,
      service_id: service.id,
      rate_unit_id: rate.rate_unit_id,
      price_per_rate: rate.value,
      formikKey: Math.random(),
      description: '',
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
                  addAction={
                    disabled || !this.props.formikProps.values.rate_group_id ? undefined : () => this.setState({ dialogOpen: true })
                  }
                />
                <div style={{ overflowX: 'auto' }}>
                  {!this.props.formikProps.values.rate_group_id && (
                    <Typography variant={'body2'} style={{ paddingLeft: '24px' }}>
                      <b>Hinweis:</b> Es muss zuerst eine Tarif-Gruppe ausgewählt sein, bevor neue Positionen zur Offerte hinzugefügt werden
                      können.
                    </Typography>
                  )}
                  <Table padding={'dense'} style={{ minWidth: '1200px' }}>
                    <TableHead>
                      <TableRow>
                        <DimeTableCell style={{ width: '5%' }} />
                        <DimeTableCell style={{ width: '15%' }}>Service</DimeTableCell>
                        <DimeTableCell style={{ width: '17%' }}>Beschreibung</DimeTableCell>
                        <DimeTableCell style={{ width: '15%' }}>Tarif</DimeTableCell>
                        <DimeTableCell style={{ width: '15%' }}>Tariftyp</DimeTableCell>
                        <DimeTableCell style={{ width: '10%' }}>Menge</DimeTableCell>
                        <DimeTableCell style={{ width: '10%' }}>MwSt.</DimeTableCell>
                        <DimeTableCell>Total CHF (mit MWSt.)</DimeTableCell>
                        <DimeTableCell style={{ width: '8%' }}>Aktionen</DimeTableCell>
                      </TableRow>
                    </TableHead>
                    <DraggableTableBody
                      arrayHelpers={arrayHelpers}
                      name={this.props.name}
                      renderRow={({ row, index, provided }) => {
                        const p = row as OfferPosition;
                        const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                        const total = p.amount * p.price_per_rate + p.amount * p.price_per_rate * p.vat;
                        return (
                          <>
                            <DimeTableCell {...provided.dragHandleProps}>
                              <DragHandle />
                            </DimeTableCell>
                            <DimeTableCell>{this.props.serviceStore!.getName(values.positions[index].service_id)}</DimeTableCell>
                            <DimeTableCell>
                              <DimeField
                                delayed
                                component={TextField}
                                name={name('description')}
                                margin={'none'}
                                disabled={disabled}
                                fullWidth
                                multiline
                                rowsMax={6}
                              />
                            </DimeTableCell>
                            <DimeTableCell>
                              <DimeField
                                delayed
                                component={CurrencyField}
                                name={name('price_per_rate')}
                                margin={'none'}
                                disabled={disabled}
                              />
                            </DimeTableCell>
                            <DimeTableCell>
                              <DimeField disabled portal component={RateUnitSelector} name={name('rate_unit_id')} margin={'none'} />
                            </DimeTableCell>
                            <DimeTableCell>
                              <DimeField delayed component={NumberField} name={name('amount')} margin={'none'} disabled={disabled} />
                            </DimeTableCell>
                            <DimeTableCell>
                              <DimeField delayed component={PercentageField} name={name('vat')} margin={'none'} disabled={disabled} />
                            </DimeTableCell>
                            <DimeTableCell>{this.props.mainStore!.formatCurrency(total, false)}</DimeTableCell>
                            <DimeTableCell>
                              <DeleteButton onConfirm={() => arrayHelpers.remove(index)} disabled={disabled} />
                            </DimeTableCell>
                          </>
                        );
                      }}
                    />
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
