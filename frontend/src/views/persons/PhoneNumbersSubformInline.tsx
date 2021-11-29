import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { TextField } from 'src/form/fields/common';
import Select from 'src/form/fields/Select';
import { ConfirmationButton } from 'src/layout/ConfirmationDialog';
import { PeopleStore } from 'src/stores/peopleStore';
import { DimeField } from '../../form/fields/formik';
import { DimePaper } from '../../layout/DimePaper';
import { DimeTableCell } from '../../layout/DimeTableCell';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import { Company, Person, PhoneNumber } from '../../types';
import compose from '../../utilities/compose';

export interface Props {
  mainStore?: MainStore;
  peopleStore?: PeopleStore;
  formikProps: FormikProps<Person | Company>;
  name: string;
  disabled?: boolean;
  inherited?: PhoneNumber[];
}

@compose(
  inject('mainStore', 'peopleStore'),
  observer,
)
export default class PhoneNumberSubformInline extends React.Component<Props> {

  private options = [
    { value: 1, label: 'Hauptnummer' },
    { value: 2, label: 'Direktwahl' },
    { value: 3, label: 'Privat' },
    { value: 4, label: 'Mobile' },
    { value: 5, label: 'Fax' },
  ];
  handleAdd = (arrayHelpers: ArrayHelpers) => {
    arrayHelpers.push({
      category: undefined,
      formikKey: Math.random(),
      number: '',
    });
  }

  render() {
    const { values } = this.props.formikProps;
    const { inherited = [] } = this.props;
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <DimePaper>
            <TableToolbar title={'Telefonnummern'} numSelected={0} addAction={() => this.handleAdd(arrayHelpers)} />
            <Table size="small" style={{ minWidth: '1000px' }}>
              <TableHead>
                <TableRow>
                  <DimeTableCell style={{ width: '40%' }}>Kategorie</DimeTableCell>
                  <DimeTableCell style={{ width: '40%' }}>Nummer</DimeTableCell>
                  <DimeTableCell style={{ width: '20%' }}>Aktionen</DimeTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inherited.map((phoneNumber: PhoneNumber) => {
                  const category = this.options.find(o => o.value === phoneNumber.category);
                  return (
                    <TableRow key={phoneNumber.id}>
                      <DimeTableCell>{category ? category.label : '?'}</DimeTableCell>
                      <DimeTableCell>{phoneNumber.number}</DimeTableCell>
                      <DimeTableCell>(von Firma)</DimeTableCell>
                    </TableRow>
                  );
                })}
                {(values.phone_numbers ? values.phone_numbers : []).map(
                  (phoneNumber: PhoneNumber & { formikKey?: number }, index: number) => {
                    const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                    return (
                      <TableRow key={phoneNumber.id || phoneNumber.formikKey}>
                        <DimeTableCell>
                          <DimeField delayed component={Select} name={name('category')} margin={'none'} options={this.options} />
                        </DimeTableCell>
                        <DimeTableCell>
                          <DimeField delayed component={TextField} name={name('number')} margin={'none'} />
                        </DimeTableCell>
                        <DimeTableCell>
                          <ConfirmationButton onConfirm={() => arrayHelpers.remove(index)} />
                        </DimeTableCell>
                      </TableRow>
                    );
                  },
                )}
              </TableBody>
            </Table>
          </DimePaper>
        )}
      />
    );
  }
}
