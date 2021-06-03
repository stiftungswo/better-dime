import Table from '@material-ui/core/Table/Table';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import {NumberField, SwitchField, TextField} from 'src/form/fields/common';
import { ConfirmationButton } from 'src/layout/ConfirmationDialog';
import { PeopleStore } from 'src/stores/peopleStore';
import { DimeField } from '../../form/fields/formik';
import { DimePaper } from '../../layout/DimePaper';
import { DimeTableCell } from '../../layout/DimeTableCell';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import { Address, Company, Person } from '../../types';
import compose from '../../utilities/compose';

const template = () => ({
  city: '',
  country: '',
  description: '',
  formikKey: Math.random(),
  zip: 0,
  street: '',
  hidden: false,
  supplement: '',
});

export interface Props {
  mainStore?: MainStore;
  peopleStore?: PeopleStore;
  formikProps: FormikProps<Person | Company>;
  name: string;
  disabled?: boolean;
  inherited?: Address[];
  hideable?: boolean;
}

@compose(
  inject('mainStore', 'peopleStore'),
  observer,
)
export default class AddressesSubformInline extends React.Component<Props> {
  handleAdd = (arrayHelpers: ArrayHelpers) => {
    arrayHelpers.push(template());
  }

  render() {
    const { values } = this.props.formikProps;
    const { inherited = [], hideable = false } = this.props;
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <DimePaper>
            <TableToolbar title={'Adressen'} numSelected={0} addAction={() => this.handleAdd(arrayHelpers)} />
            <Table padding={'dense'} style={{ minWidth: '1000px' }}>
              <TableHead>
                <TableRow>
                  <DimeTableCell style={{ width: '20%' }}>Strasse</DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}>Addresszusatz</DimeTableCell>
                  <DimeTableCell style={{ width: '10%' }}>PLZ</DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}>Stadt</DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}>Land</DimeTableCell>
                  <DimeTableCell style={{ width: '30%' }}>Kommentar</DimeTableCell>
                  {hideable && <DimeTableCell style={{ width: '15%' }}>Versteckt</DimeTableCell>}
                  <DimeTableCell style={{ width: '15%' }}>Aktionen</DimeTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inherited.map((a: Address) => (
                  <TableRow key={a.id}>
                    <DimeTableCell>{a.street}</DimeTableCell>
                    <DimeTableCell>{a.supplement}</DimeTableCell>
                    <DimeTableCell>{a.zip}</DimeTableCell>
                    <DimeTableCell>{a.city}</DimeTableCell>
                    <DimeTableCell>{a.country}</DimeTableCell>
                    <DimeTableCell>{a.description}</DimeTableCell>
                    {hideable && <DimeTableCell>{a.hidden}</DimeTableCell>}
                    <DimeTableCell>(von Firma)</DimeTableCell>
                  </TableRow>
                ))}
                {(values.addresses ? values.addresses : []).map((a: Address & { formikKey?: number }, index: number) => {
                  const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                  return (
                    <TableRow key={a.id || a.formikKey}>
                      <DimeTableCell>
                        <DimeField delayed component={TextField} name={name('street')} margin={'none'} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField delayed component={TextField} name={name('supplement')} margin={'none'} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField delayed component={NumberField} name={name('zip')} margin={'none'} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField delayed component={TextField} name={name('city')} margin={'none'} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField delayed component={TextField} name={name('country')} margin={'none'} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField delayed component={TextField} name={name('description')} margin={'none'} multiline={true} />
                      </DimeTableCell>
                      {hideable && <DimeTableCell>
                        <DimeField delayed component={SwitchField} name={name('hidden')} margin={'none'} />
                      </DimeTableCell>}
                      <DimeTableCell>
                        <ConfirmationButton onConfirm={() => arrayHelpers.remove(index)} />
                      </DimeTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DimePaper>
        )}
      />
    );
  }
}
