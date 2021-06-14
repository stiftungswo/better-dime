import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import {Warning} from '@material-ui/icons';
import {FieldArrayRenderProps} from 'formik';
import { inject } from 'mobx-react';
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
import { ServiceStore } from '../../stores/serviceStore';
import {OfferPosition, PositionGroup} from '../../types';
import compose from '../../utilities/compose';
import {isAfterArchivedUnitsCutoff} from '../../utilities/validation';
import { DraggableTableBody } from '../invoices/DraggableTableBody';

interface Props {
  mainStore?: MainStore;
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
  inject('mainStore', 'serviceStore'),
)
export default class OfferPositionRenderer extends React.Component<Props> {
  render() {
    const { arrayHelpers, values, group, isFirst, disabled, onDelete, onMove, onAdd } = this.props;
    const afterUnitInvalidation = isAfterArchivedUnitsCutoff(this.props.values.created_at);

    return (
      <>
        {!isFirst && (
          <div style={{ paddingTop: '20px' }}/>
        )}
        <TableToolbar
          title={'Services - ' + group.name}
          numSelected={0}
          addAction={disabled ? undefined : onAdd}
        />
        <div style={{ overflowX: 'auto' }}>
          {!values.rate_group_id && (
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
                <DimeTableCell style={{ width: '8%' }}>MwSt.</DimeTableCell>
                <DimeTableCell>Total CHF (mit MWSt.)</DimeTableCell>
                <DimeTableCell style={{ width: '10%', paddingLeft: '40px' }}>Aktionen</DimeTableCell>
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
                const archivedService = this.props.serviceStore!.getArchived(values.positions[pIdx].service_id);
                const archivedRate = p.rate_unit_archived;
                return (
                  <>
                    <DimeTableCell {...provided.dragHandleProps}>
                      <DragHandle />
                    </DimeTableCell>
                    <DimeTableCell>
                      {(!archivedService || !afterUnitInvalidation) && (
                        <>{this.props.serviceStore!.getName(values.positions[pIdx].service_id)}</>
                      )}
                      {archivedService && afterUnitInvalidation && (
                        <Grid container direction="row" alignItems="center">
                          <Grid item>
                            <Warning color={'error'}/>
                          </Grid>
                          <Grid item style={{color: 'red', marginLeft: '5px', width: 'calc(100% - 32px)'}}>
                            {this.props.serviceStore!.getName(values.positions[pIdx].service_id)}
                          </Grid>
                        </Grid>
                      )}
                    </DimeTableCell>
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
                      {(!archivedRate || !afterUnitInvalidation) && (
                        <DimeField disabled component={RateUnitSelect} name={name('rate_unit_id')} margin={'none'} />
                      )}
                      {archivedRate && afterUnitInvalidation && (
                        <Grid container direction="row" alignItems="center">
                          <Grid item style={{color: 'red', width: 'calc(100% - 32px)'}}>
                            <DimeField disabled component={RateUnitSelect} name={name('rate_unit_id')} margin={'none'} />
                          </Grid>
                          <Grid item style={{marginLeft: '5px'}}>
                            <Warning color={'error'}/>
                          </Grid>
                        </Grid>
                      )}
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField component={NumberField} name={name('amount')} margin={'none'} disabled={disabled} />
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField delayed component={PercentageField} name={name('vat')} margin={'none'} disabled={disabled} />
                    </DimeTableCell>
                    <DimeTableCell>{this.props.mainStore!.formatCurrency(total, false)}</DimeTableCell>
                    <DimeTableCell style={{paddingRight: '0px'}}>
                      <ActionButton
                        icon={MoveIcon}
                        action={() => onMove(pIdx)}
                        title={'Verschieben'}
                        disabled={disabled}
                      />
                      <ConfirmationButton onConfirm={() => onDelete(pIdx)} disabled={disabled} />
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
