import * as React from 'react';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Address, Person } from '../../types';
import { MainStore } from '../../stores/mainStore';
import TableToolbar from '../../layout/TableToolbar';
import { PeopleStore } from 'src/stores/peopleStore';
import { DeleteButton } from 'src/layout/ConfirmationDialog';
import { NumberField, TextField } from 'src/form/fields/common';
import { DimePaper } from '../../layout/DimePaper';
import { Company } from '../../types';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DimeField } from '../../form/fields/formik';

const template = () => ({
  city: '',
  country: '',
  description: '',
  formikKey: Math.random(),
  postcode: 0,
  street: '',
  supplement: '',
});

export interface Props {
  mainStore?: MainStore;
  peopleStore?: PeopleStore;
  formikProps: FormikProps<Person | Company>;
  name: string;
  disabled?: boolean;
}

@compose(
  inject('mainStore', 'peopleStore'),
  observer
)
export default class AddressesSubformInline extends React.Component<Props> {
  public handleAdd = (arrayHelpers: ArrayHelpers) => {
    arrayHelpers.push(template());
  };

  public render() {
    const { values } = this.props.formikProps;
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
                  <DimeTableCell style={{ width: '15%' }}>Aktionen</DimeTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
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
                        <DimeField delayed component={NumberField} name={name('postcode')} margin={'none'} />
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
                      <DimeTableCell>
                        <DeleteButton onConfirm={() => arrayHelpers.remove(index)} />
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
