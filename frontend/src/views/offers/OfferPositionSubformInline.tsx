import { Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import { inject, Observer, observer } from 'mobx-react';
import * as React from 'react';
import { RateUnitSelect } from '../../form/entitySelect/RateUnitSelect';
import { NumberField, TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeField } from '../../form/fields/formik';
import PercentageField from '../../form/fields/PercentageField';
import { ServiceSelectDialog } from '../../form/ServiceSelectDialog';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DragHandle } from '../../layout/icons';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import {OfferStore} from '../../stores/offerStore';
import {PositionGroupStore} from '../../stores/positionGroupStore';
import { ServiceStore } from '../../stores/serviceStore';
import {Offer, OfferPosition, PositionGroup, Service, ServiceRate} from '../../types';
import compose from '../../utilities/compose';
import { getInsertionIndex } from '../../utilities/getInsertionIndex';
import { DraggableTableBody } from '../invoices/DraggableTableBody';

export interface Props {
  mainStore?: MainStore;
  serviceStore?: ServiceStore;
  positionGroupStore?: PositionGroupStore;
  offerStore?: OfferStore;
  formikProps: FormikProps<Offer>;
  name: string;
  disabled?: boolean;
}

@compose(
  inject('mainStore', 'serviceStore', 'offerStore', 'positionGroupStore'),
  observer,
)
export default class OfferPositionSubformInline extends React.Component<Props> {
  state = {
    dialogOpen: false,
    selected_group: undefined,
  };

  insertService = (arrayHelpers: ArrayHelpers, service: Service, rate: ServiceRate, groupId: number | null) => {
    const insertIndex = getInsertionIndex(this.props.formikProps.values.positions.map(p => p.order), service.order, (a, b) => a - b);
    arrayHelpers.insert(insertIndex, {
      description: '',
      order: service.order,
      vat: service.vat,
      service_id: service.id,
      position_group_id: groupId,
      rate_unit_id: rate.rate_unit_id,
      price_per_rate: rate.value,
      formikKey: Math.random(),
    });
  }

  handleAdd = (arrayHelpers: ArrayHelpers) => (service: Service, groupName: string | null) => {
    const rate = service.service_rates.find(r => r.rate_group_id === this.props.formikProps.values.rate_group_id);
    if (!rate) {
      throw new Error('no rate was found');
    }

    const group = this.props.formikProps.values.position_groupings.find((e: PositionGroup) => e.name === groupName);

    if (group == null && groupName != null && groupName.length > 0) {
      this.props.positionGroupStore!.post({name: groupName}).then(nothing => {
        this.props.formikProps.values.position_groupings.push({
          id: this.props.positionGroupStore!.positionGroup!.id,
          name: groupName,
        });
        this.insertService(arrayHelpers, service, rate, this.props.positionGroupStore!.positionGroup!.id!);
      });
    } else if (group != null && group.id != null) {
      this.insertService(arrayHelpers, service, rate, group.id);
    } else {
      this.insertService(arrayHelpers, service, rate, null);
    }
  }

  renderTable = (arrayHelpers: any, values: any, group: PositionGroup, isFirst: boolean) => {
    const { disabled } = this.props;

    return (
      <>
        {!isFirst && (
          <div style={{ paddingTop: '20px' }}/>
        )}
        <TableToolbar
          title={'Services - ' + group.name}
          numSelected={0}
          addAction={
            disabled || !this.props.formikProps.values.rate_group_id ? undefined : () => {
              this.setState({ selected_group: group.name, dialogOpen: true });
            }
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
              filterKey={'position_group_id'}
              filterValue={group.id}
              renderRow={({ row, index, provided }) => {
                const p = row as OfferPosition;
                const pIdx = values.positions.indexOf(p);
                const name = (fieldName: string) => `${this.props.name}.${pIdx}.${fieldName}`;
                const total = p.amount * p.price_per_rate + p.amount * p.price_per_rate * p.vat;
                return (
                  <>
                    <DimeTableCell {...provided.dragHandleProps}>
                      <DragHandle />
                    </DimeTableCell>
                    <DimeTableCell>{this.props.serviceStore!.getName(values.positions[pIdx].service_id)}</DimeTableCell>
                    <DimeTableCell>
                      <DimeField
                        delayed
                        component={TextField}
                        name={name('description')}
                        margin={'none'}
                        disabled={disabled}
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
                      <DimeField disabled portal component={RateUnitSelect} name={name('rate_unit_id')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField delayed component={NumberField} name={name('amount')} margin={'none'} disabled={disabled} />
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField delayed component={PercentageField} name={name('vat')} margin={'none'} disabled={disabled} />
                    </DimeTableCell>
                    <DimeTableCell>{this.props.mainStore!.formatCurrency(total, false)}</DimeTableCell>
                    <DimeTableCell>
                      <DeleteButton onConfirm={() => arrayHelpers.remove(pIdx)} disabled={disabled} />
                    </DimeTableCell>
                  </>
                );
              }}
            />
          </Table>
        </div>
      </>
    );
  }

  render() {
    const { values } = this.props.formikProps;
    const groups = [{id: null, name: 'Generell'}, ...values.position_groupings];

    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <Observer>
            {() => (
              <>
                {groups.filter(e => e != null && (e.name === 'Generell' || values.positions.filter(p => {
                    return p.position_group_id === e.id;
                  }).length > 0)).map((e: any, index: number) => {
                    return this.renderTable(arrayHelpers, values, e, index === 0);
                  })}
                {this.state.dialogOpen && (
                  <ServiceSelectDialog
                    open
                    onClose={() => this.setState({ dialogOpen: false })}
                    onSubmit={this.handleAdd(arrayHelpers)}
                    groupName={this.state.selected_group}
                    groupingEntity={this.props.formikProps.values}
                  />
                )}
              </>
            )}
          </Observer>
        )}
      />
    );
  }
}
