import {Divider, Typography} from '@material-ui/core';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RateUnitSelect } from '../../form/entitySelect/RateUnitSelect';
import { TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeField } from '../../form/fields/formik';
import PercentageField from '../../form/fields/PercentageField';
import PositionMoveDialog from '../../form/PositionMoveDialog';
import { ServiceSelectDialog } from '../../form/ServiceSelectDialog';
import {ActionButton} from '../../layout/ActionButton';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import {DragHandle, MoveIcon} from '../../layout/icons';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import {PositionGroupStore} from '../../stores/positionGroupStore';
import {ProjectStore} from '../../stores/projectStore';
import { ServiceStore } from '../../stores/serviceStore';
import {PositionGroup, Project, ProjectPosition, Service, ServiceRate} from '../../types';
import compose from '../../utilities/compose';
import { getInsertionIndex } from '../../utilities/getInsertionIndex';
import {defaultPositionGroup} from '../../utilities/helpers';
import { DraggableTableBody } from '../invoices/DraggableTableBody';

export interface Props {
  mainStore?: MainStore;
  serviceStore?: ServiceStore;
  projectStore?: ProjectStore;
  positionGroupStore?: PositionGroupStore;
  formikProps: FormikProps<Project>;
  name: string;
}

@compose(
  inject('mainStore', 'serviceStore', 'positionGroupStore', 'projectStore'),
  observer,
)
export default class ProjectPositionSubformInline extends React.Component<Props> {
  state = {
    dialogOpen: false,
    selected_group: undefined,
    moving: false,
    moving_index: null,
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

  handleUpdate = (arrayHelpers: ArrayHelpers) => (positionIndex: number, newGroupId: number | null) => {
    const item = arrayHelpers.remove(positionIndex) as ProjectPosition;
    // tslint:disable-next-line:no-console
    console.log('Update index:', item, ' to the new id ', newGroupId);
    item.position_group_id = newGroupId;
    const insertIndex = getInsertionIndex(this.props.formikProps.values.positions.map(p => p.order), item.order, (a, b) => a - b);
    arrayHelpers.insert(insertIndex, item);
  }

  handleAdd = (arrayHelpers: ArrayHelpers) => (service: Service, groupName: string) => {
    const rate = service.service_rates.find(r => r.rate_group_id === this.props.formikProps.values.rate_group_id);
    if (!rate) {
      throw new Error('no rate was found');
    }

    const group = [defaultPositionGroup(), ...this.props.formikProps.values.position_groupings].find((e: PositionGroup) => {
      return e.name.toLowerCase() === groupName.toLowerCase();
    });

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
    return (
      <>
        {!isFirst && (
          <div style={{ paddingTop: '20px' }}/>
        )}
        <TableToolbar
          title={'Services - ' + group.name}
          numSelected={0}
          addAction={!this.props.formikProps.values.rate_group_id ? undefined : () => {
            this.setState({ selected_group: group.name, dialogOpen: true });
          }}
        />
        <div style={{ overflowX: 'auto' }}>
          {!this.props.formikProps.values.rate_group_id && (
            <Typography variant={'body2'} style={{ paddingLeft: '24px' }}>
              <b>Hinweis:</b> Es muss zuerst eine Tarif-Gruppe ausgewählt sein, bevor neue Positionen zum Projekt hinzugefügt werden
              können.
            </Typography>
          )}
          <Table padding={'dense'} style={{ minWidth: '1200px' }}>
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
                return (
                  <>
                    <DimeTableCell {...provided.dragHandleProps}>
                      <DragHandle />
                    </DimeTableCell>
                    <DimeTableCell>{this.props.serviceStore!.getName(values.positions[pIdx].service_id)}</DimeTableCell>
                    <DimeTableCell>
                      <DimeField delayed component={TextField} name={name('description')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField delayed required component={CurrencyField} name={name('price_per_rate')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField disabled required component={RateUnitSelect} name={name('rate_unit_id')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>
                      <DimeField required delayed component={PercentageField} name={name('vat')} margin={'none'} />
                    </DimeTableCell>
                    <DimeTableCell>{p.efforts_value_with_unit}</DimeTableCell>
                    <DimeTableCell>{this.props.mainStore!.formatCurrency(p.charge, false)}</DimeTableCell>
                    <DimeTableCell style={{paddingRight: '0px'}}>
                      <ActionButton
                        icon={MoveIcon}
                        action={() => {
                          this.setState({moving: true, moving_index: pIdx});
                        }}
                        title={'Verschieben'}
                      />
                      <DeleteButton
                        onConfirm={() => arrayHelpers.remove(pIdx)}
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

  render() {
    const { values } = this.props.formikProps;
    const groups = [defaultPositionGroup(), ...values.position_groupings];

    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => {
          return (
            <>
              {groups.filter(e => e != null && (e.name === defaultPositionGroup().name || values.positions.filter(p => {
                return p.position_group_id === e.id;
              }).length > 0)).sort((a: PositionGroup, b: PositionGroup) => {
                return a.name.localeCompare(b.name);
              }).map((e: any, index: number) => {
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
              {this.state.moving && (
                <PositionMoveDialog
                  positionIndex={this.state.moving_index!}
                  groupingEntity={this.props.formikProps.values}
                  onUpdate={this.handleUpdate(arrayHelpers)}
                  onClose={() => {
                    this.setState({moving: false, moving_index: null});
                  }}
                />
              )}
            </>
          );
          }
        }
      />
    );
  }
}
