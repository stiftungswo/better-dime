import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import {Warning} from '@material-ui/icons';
import {FieldArray, FieldArrayRenderProps, FormikProps} from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RateUnitSelect } from '../../form/entitySelect/RateUnitSelect';
import { NumberField, TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeField } from '../../form/fields/formik';
import PercentageField from '../../form/fields/PercentageField';
import {ActionButton} from '../../layout/ActionButton';
import { ConfirmationButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import {DragHandle, MoveIcon} from '../../layout/icons';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import {RateUnitStore} from '../../stores/rateUnitStore';
import {ServiceStore} from '../../stores/serviceStore';
import {Invoice, InvoicePosition, PositionGroup, RateUnit} from '../../types';
import compose from '../../utilities/compose';
import {isAfterArchivedUnitsCutoff} from '../../utilities/validation';
import { DraggableTableBody } from './DraggableTableBody';

const template = (groupId?: number) => ({
  amount: 0,
  description: '',
  formikKey: Math.random(),
  order: 100,
  price_per_rate: 0,
  rate_unit_id: 0,
  vat: 0.077,
  position_group_id: groupId ? groupId : null,
});

interface Props {
  mainStore?: MainStore;
  rateUnitStore?: RateUnitStore;
  serviceStore?: ServiceStore;
  arrayHelpers: FieldArrayRenderProps;
  onDelete: (idx: number) => void;
  onMove: (idx: number) => void;
  onAdd: (() => void) | undefined;
  group: PositionGroup;
  values: any;
  isFirst?: boolean;
  disabled?: boolean;
  name: string;
}

@compose(
  inject('mainStore', 'rateUnitStore'),
  observer,
)
export default class InvoicePositionRenderer extends React.Component<Props> {
  render() {
    const { arrayHelpers, values, group, isFirst, disabled, onDelete, onMove, onAdd } = this.props;
    const afterUnitInvalidation = isAfterArchivedUnitsCutoff(this.props.values.created_at);

    return (
      <>
        {!isFirst && (
          <div style={{ paddingTop: '20px' }}/>
        )}
        <TableToolbar title={'Rechnungsposten - ' + group.name} addAction={() => arrayHelpers.push(template(group.id))} />
        <div style={{ overflowX: 'auto' }}>
          <Table padding={'dense'} style={{ minWidth: '1200px' }}>
            <TableHead>
              <TableRow>
                <DimeTableCell style={{ width: '5%' }} />
                <DimeTableCell style={{ width: '28%' }}>Beschreibung</DimeTableCell>
                <DimeTableCell style={{ width: '15%' }}>Tarif</DimeTableCell>
                <DimeTableCell style={{ width: '17%' }}>Tariftyp</DimeTableCell>
                <DimeTableCell style={{ width: '10%' }}>Menge</DimeTableCell>
                <DimeTableCell style={{ width: '8%' }}>MwSt.</DimeTableCell>
                <DimeTableCell style={{ width: '7%' }}>Total CHF</DimeTableCell>
                <DimeTableCell style={{ width: '10%', paddingLeft: '40px'  }}>Aktionen</DimeTableCell>
              </TableRow>
            </TableHead>
            <DraggableTableBody
              arrayHelpers={arrayHelpers}
              name={this.props.name}
              filterKey={'position_group_id'}
              filterValue={group.id}
              renderRow={({ row, index, provided }) => {
                const p = row as InvoicePosition;
                const pIdx = values.positions.indexOf(p);
                const name = <T extends keyof InvoicePosition>(fieldName: T) => `${this.props.name}.${pIdx}.${fieldName}`;
                const total = p.calculated_total * (1 + p.vat);
                const rateUnit = this.props.rateUnitStore!.rateUnits.find((r: RateUnit) => {
                  return r.id === p.rate_unit_id;
                });
                const archivedRate = rateUnit != null && rateUnit.archived;
                return (
                  <>
                    <DimeTableCell {...provided.dragHandleProps}>
                      <DragHandle />
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField delayed component={TextField} name={name('description')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField delayed component={CurrencyField} name={name('price_per_rate')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>
                      {(!archivedRate || !afterUnitInvalidation) && (
                        <DimeField component={RateUnitSelect} name={name('rate_unit_id')} margin={'none'} />
                      )}
                      {archivedRate && afterUnitInvalidation && (
                        <Grid container direction="row" alignItems="center">
                          <Grid item style={{color: 'red', width: 'calc(100% - 32px)'}}>
                            <DimeField component={RateUnitSelect} name={name('rate_unit_id')} margin={'none'} />
                          </Grid>
                          <Grid item style={{marginLeft: '5px'}}>
                            <Warning color={'error'}/>
                          </Grid>
                        </Grid>
                      )}
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField component={NumberField} name={name('amount')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField delayed component={PercentageField} name={name('vat')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>{this.props.mainStore!.formatCurrency(total, false)}</DimeTableCell>
                    <DimeTableCell style={{paddingRight: '0px'}}>
                      <ActionButton
                        icon={MoveIcon}
                        action={() => onMove(pIdx)}
                        title={'Verschieben'}
                        disabled={disabled}
                      />
                      <ConfirmationButton onConfirm={() => onDelete(pIdx)} />
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
}
