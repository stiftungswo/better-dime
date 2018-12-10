import * as React from 'react';
import { ArrayHelpers, Field, FieldArray, FormikProps } from 'formik';
import { TextField } from '../../form/fields/common';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Project, ProjectPosition } from '../../types';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import TableToolbar from '../../layout/TableToolbar';
import PercentageField from '../../form/fields/PercentageField';
import { RateUnitSelector } from '../../form/entitySelector/RateUnitSelector';
import CurrencyField from '../../form/fields/CurrencyField';
import { ServiceStore } from '../../stores/serviceStore';
import { Service } from '../services/types';
import { ServiceSelectDialog } from '../../form/ServiceSelectDialog';
import { MainStore } from '../../stores/mainStore';

export interface Props {
  mainStore?: MainStore;
  serviceStore?: ServiceStore;
  formikProps: FormikProps<Project>;
  name: string;
}

@compose(
  inject('mainStore', 'serviceStore'),
  observer
)
export default class ProjectPositionSubformInline extends React.Component<Props> {
  state = {
    dialogOpen: false,
  };

  public handleAdd = (arrayHelpers: ArrayHelpers) => (service: Service) => {
    const rate = service.service_rates.find(r => r.rate_group_id === this.props.formikProps.values.rate_group_id);
    if (!rate) {
      throw new Error('no rate was found');
    }
    arrayHelpers.push({
      description: '',
      order: 100,
      vat: service.vat,
      service_id: service.id,
      rate_unit_id: rate.rate_unit_id,
      price_per_rate: rate.value,
    });
  };

  public componentWillMount = () => this.props.serviceStore!.fetchAll();

  public render() {
    const { values } = this.props.formikProps;
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <>
            <TableToolbar title={'Services'} numSelected={0} addAction={() => this.setState({ dialogOpen: true })} />
            <div style={{ overflowX: 'auto' }}>
              <Table padding={'dense'} style={{ minWidth: '1200px' }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '20%' }}>Service</TableCell>
                    <TableCell style={{ width: '20%' }}>Beschreibung</TableCell>
                    <TableCell style={{ width: '15%' }}>Tarif</TableCell>
                    <TableCell style={{ width: '15%' }}>Einheit</TableCell>
                    <TableCell style={{ width: '10%' }}>MwSt.</TableCell>
                    <TableCell style={{ width: '10%' }}>Anzahl</TableCell>
                    <TableCell style={{ width: '10%' }}>Total CHF (mit MWSt.)</TableCell>
                    <TableCell style={{ width: '10%' }}>Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.positions.map((p: ProjectPosition, index: number) => {
                    const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                    return (
                      <TableRow key={index}>
                        <TableCell>{this.props.serviceStore!.getName(values.positions[index].service_id)}</TableCell>
                        <TableCell>
                          <Field delayed component={TextField} name={name('description')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field delayed required component={CurrencyField} name={name('price_per_rate')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field disabled required component={RateUnitSelector} name={name('rate_unit_id')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field required delayed component={PercentageField} name={name('vat')} margin={'none'} />
                        </TableCell>
                        <TableCell>{p.efforts_value_with_unit}</TableCell>
                        <TableCell>{this.props.mainStore!.formatCurrency(p.charge, false)}</TableCell>
                        <TableCell>
                          <DeleteButton onConfirm={() => arrayHelpers.remove(index)} />
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
      />
    );
  }
}
