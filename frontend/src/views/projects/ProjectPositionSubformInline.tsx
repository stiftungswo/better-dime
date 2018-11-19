import * as React from 'react';
import { Field, FieldArray, FormikProps } from 'formik';
import { NumberField, TextField } from '../../form/fields/common';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Project, ProjectPosition } from '../../types';
import { ServiceSelector } from '../../form/entitySelector/ServiceSelector';
import { MainStore } from '../../stores/mainStore';
import { DeleteButton } from '../../layout/ConfirmationDialog';
import TableToolbar from '../../layout/TableToolbar';
import PercentageField from '../../form/fields/PercentageField';
import { RateUnitSelector } from '../../form/entitySelector/RateUnitSelector';
import CurrencyField from '../../form/fields/CurrencyField';

const template = {
  description: '',
  service_id: '',
  price_per_rate: 0,
  rate_unit_id: '',
  vat: 0.077, // this should probably be configurable somewhere; user settings?
};

export interface Props {
  mainStore?: MainStore;
  formikProps: FormikProps<Project>;
  name: string;
}

@compose(observer)
export default class ProjectPositionSubformInline extends React.Component<Props> {
  public render() {
    const { values } = this.props.formikProps;
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <>
            <TableToolbar title={'Services'} numSelected={0} addAction={() => arrayHelpers.push(template)} />
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
                    <TableCell style={{ width: '10%' }}>Total CHF</TableCell>
                    <TableCell style={{ width: '10%' }}>Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.positions.map((p: ProjectPosition, index: number) => {
                    const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Field component={ServiceSelector} name={name('service_id')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field delayed component={TextField} name={name('description')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field delayed component={CurrencyField} name={name('price_per_rate')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field component={RateUnitSelector} name={name('rate_unit_id')} margin={'none'} />
                        </TableCell>
                        <TableCell>
                          <Field delayed component={PercentageField} name={name('vat')} margin={'none'} />
                        </TableCell>
                        <TableCell>{p.efforts_value}</TableCell>
                        <TableCell>{p.charge}</TableCell>
                        <TableCell>
                          <DeleteButton onConfirm={() => arrayHelpers.remove(index)} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      />
    );
  }
}
