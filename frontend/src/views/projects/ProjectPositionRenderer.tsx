import {Divider, Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {Warning} from '@material-ui/icons';
import {FieldArrayRenderProps} from 'formik';
import { inject } from 'mobx-react';
import * as React from 'react';
import { RateUnitSelect } from '../../form/entitySelect/RateUnitSelect';
import {TextField} from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeField } from '../../form/fields/formik';
import PercentageField, { VatField } from '../../form/fields/PercentageField';
import {ActionButton} from '../../layout/ActionButton';
import { ConfirmationButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import {DragHandle, MoveIcon, RenameIcon, SortIcon} from '../../layout/icons';
import TableToolbar from '../../layout/TableToolbar';
import {MainStore} from '../../stores/mainStore';
import {ServiceStore} from '../../stores/serviceStore';
import {PositionGroup, ProjectPosition} from '../../types';
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
  onSort: (() => void) | undefined;
  onRename: (() => void) | undefined;
  group: PositionGroup;
  values: any;
  isFirst?: boolean;
  name: string;
}

@compose(
  inject('mainStore', 'serviceStore'),
)
export default class ProjectPositionRenderer extends React.Component<Props> {
  render() {
    const { arrayHelpers, values, group, isFirst, onDelete, onMove, onAdd, onSort, onRename } = this.props;
    const afterUnitInvalidation = isAfterArchivedUnitsCutoff(this.props.values.created_at);

    return (
      <>
        {!isFirst && (
          <div style={{ paddingTop: '20px' }}/>
        )}
        <TableToolbar
          title={'Services - ' + group.name}
          numSelected={0}
          addAction={onAdd}
        >
          <ActionButton icon={RenameIcon} action={onRename} title={'Servicegruppe umbenennen.'} />
          <ActionButton icon={SortIcon} action={onSort} title={'Alle Services nach Standardsortierung umsortieren.'} />
        </TableToolbar>
        <div style={{ overflowX: 'auto' }}>
          {!values.rate_group_id && (
            <Typography variant={'body2'} style={{ paddingLeft: '24px' }}>
              <b>Hinweis:</b> Es muss zuerst eine Tarif-Gruppe ausgewählt sein, bevor neue Positionen zum Projekt hinzugefügt werden
              können.
            </Typography>
          )}
          <Table size="small" style={{ minWidth: '1200px' }}>
            <TableHead>
              <TableRow>
                <DimeTableCell style={{ width: '5%' }} />
                <DimeTableCell style={{ width: '17%' }}>Service</DimeTableCell>
                <DimeTableCell style={{ width: '17.5%' }}>Beschreibung</DimeTableCell>
                <DimeTableCell style={{ width: '12.5%' }}>Tarif</DimeTableCell>
                <DimeTableCell style={{ width: '17.5%' }}>Einheit</DimeTableCell>
                <DimeTableCell style={{ width: '8%' }}>MwSt.</DimeTableCell>
                <DimeTableCell style={{ width: '7%' }}>Anzahl</DimeTableCell>
                <DimeTableCell style={{ width: '5%' }}>Total CHF (mit MWSt.)</DimeTableCell>
                <DimeTableCell style={{ width: '15.5%', paddingLeft: '40px' }}>Aktionen</DimeTableCell>
              </TableRow>
            </TableHead>
            <DraggableTableBody
              arrayHelpers={arrayHelpers}
              name={this.props.name}
              filterKey={'position_group_id'}
              filterValue={group.id}
              renderRow={({ row, index, provided }) => {
                const p = row as ProjectPosition;
                const pIdx = values.positions.indexOf(p);
                const name = (fieldName: string) => `${this.props.name}.${pIdx}.${fieldName}`;
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
                      <DimeField delayed component={TextField} name={name('description')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField delayed required component={CurrencyField} name={name('price_per_rate')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>
                      {(!archivedRate || !afterUnitInvalidation) && (
                        <DimeField disabled required component={RateUnitSelect} name={name('rate_unit_id')} margin={'none'} />
                      )}
                      {archivedRate && afterUnitInvalidation && (
                        <Grid container direction="row" alignItems="center">
                          <Grid item style={{color: 'red', width: 'calc(100% - 32px)'}}>
                            <DimeField disabled required component={RateUnitSelect} name={name('rate_unit_id')} margin={'none'} />
                          </Grid>
                          <Grid item style={{marginLeft: '5px'}}>
                            <Warning color={'error'}/>
                          </Grid>
                        </Grid>
                      )}
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField required delayed component={VatField} name={name('vat')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>
                      {p.efforts_value_with_unit}
                    </DimeTableCell>
                    <DimeTableCell>{this.props.mainStore!.formatCurrency(p.charge, false)}</DimeTableCell>
                    <DimeTableCell style={{paddingRight: '0px'}}>
                      <ActionButton
                        icon={MoveIcon}
                        action={() => onMove(pIdx)}
                        title={'Verschieben'}
                      />
                      <ConfirmationButton
                        disabled={!p.deletable}
                        title={p.deletable ? 'Löschen' : 'Aufwand zuerst löschen!'}
                        /* tslint:disable-next-line:no-empty */
                        onConfirm={p.deletable ? () => onDelete(pIdx) : () => {}}
                      />
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
