import { Typography } from '@material-ui/core';
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
import { ServiceSelectDialog } from '../../form/ServiceSelectDialog';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DragHandle } from '../../layout/icons';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import { ServiceStore } from '../../stores/serviceStore';
import { Project, ProjectPosition, Service } from '../../types';
import compose from '../../utilities/compose';
import { getInsertionIndex } from '../../utilities/getInsertionIndex';
import { DraggableTableBody } from '../invoices/DraggableTableBody';

export interface Props {
  mainStore?: MainStore;
  serviceStore?: ServiceStore;
  formikProps: FormikProps<Project>;
  name: string;
}

@compose(
  inject('mainStore', 'serviceStore'),
  observer,
)
export default class ProjectPositionSubformInline extends React.Component<Props> {
  state = {
    dialogOpen: false,
  };

  handleAdd = (arrayHelpers: ArrayHelpers) => (service: Service) => {
    const rate = service.service_rates.find(r => r.rate_group_id === this.props.formikProps.values.rate_group_id);
    if (!rate) {
      throw new Error('no rate was found');
    }

    const insertIndex = getInsertionIndex(this.props.formikProps.values.positions.map(p => p.order), service.order, (a, b) => a - b);
    arrayHelpers.insert(insertIndex, {
      description: '',
      order: service.order,
      vat: service.vat,
      service_id: service.id,
      rate_unit_id: rate.rate_unit_id,
      price_per_rate: rate.value,
      formikKey: Math.random(),
    });
  }

  render() {
    const { values } = this.props.formikProps;
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <>
            <TableToolbar
              title={'Services'}
              numSelected={0}
              addAction={!this.props.formikProps.values.rate_group_id ? undefined : () => this.setState({ dialogOpen: true })}
            />
            <div style={{ overflowX: 'auto' }}>
              {!this.props.formikProps.values.rate_group_id && (
                <Typography variant={'body2'} style={{ paddingLeft: '24px' }}>
                  <b>Hinweis:</b> Es muss zuerst eine Tarif-Gruppe ausgewählt sein, bevor neue Positionen zum Projekt hinzugefügt werden
                  können.
                </Typography>
              )}
              <Table size={'small'} style={{ minWidth: '1200px' }}>
                <TableHead>
                  <TableRow>
                    <DimeTableCell style={{ width: '5%' }} />
                    <DimeTableCell style={{ width: '20%' }}>Service</DimeTableCell>
                    <DimeTableCell style={{ width: '20%' }}>Beschreibung</DimeTableCell>
                    <DimeTableCell style={{ width: '15%' }}>Tarif</DimeTableCell>
                    <DimeTableCell style={{ width: '15%' }}>Einheit</DimeTableCell>
                    <DimeTableCell style={{ width: '10%' }}>MwSt.</DimeTableCell>
                    <DimeTableCell style={{ width: '10%' }}>Anzahl</DimeTableCell>
                    <DimeTableCell style={{ width: '10%' }}>Total CHF (mit MWSt.)</DimeTableCell>
                    <DimeTableCell style={{ width: '5%' }}>Aktionen</DimeTableCell>
                  </TableRow>
                </TableHead>
                <DraggableTableBody
                  arrayHelpers={arrayHelpers}
                  name={this.props.name}
                  renderRow={({ row, index, provided }) => {
                    const p = row as ProjectPosition;
                    const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                    return (
                      <>
                        <DimeTableCell {...provided.dragHandleProps}>
                          <DragHandle />
                        </DimeTableCell>
                        <DimeTableCell>{this.props.serviceStore!.getName(values.positions[index].service_id)}</DimeTableCell>
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
                        <DimeTableCell>
                          <DeleteButton onConfirm={() => arrayHelpers.remove(index)} />
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
      />
    );
  }
}
