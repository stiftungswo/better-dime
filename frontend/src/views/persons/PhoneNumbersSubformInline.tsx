import * as React from 'react';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import TableBody from '@material-ui/core/TableBody/TableBody';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Person, PhoneNumber } from '../../types';
import { MainStore } from '../../stores/mainStore';
import TableToolbar from '../../layout/TableToolbar';
import { PeopleStore } from 'src/stores/peopleStore';
import { DeleteButton } from 'src/layout/ConfirmationDialog';
import { TextField } from 'src/form/fields/common';
import Select from 'src/form/fields/Select';
import { DimePaper } from '../../layout/DimePaper';
import { Company } from '../../types';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { DimeField } from '../../form/fields/formik';

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
export default class PhoneNumberSubformInline extends React.Component<Props> {
  public handleAdd = (arrayHelpers: ArrayHelpers) => {
    arrayHelpers.push({
      category: undefined,
      formikKey: Math.random(),
      number: '',
    });
  };

  private options = [
    { value: 1, label: 'Hauptnummer' },
    { value: 2, label: 'Direktwahl' },
    { value: 3, label: 'Privat' },
    { value: 4, label: 'Mobile' },
    { value: 5, label: 'Fax' },
  ];

  public render() {
    const { values } = this.props.formikProps;
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <DimePaper>
            <TableToolbar title={'Telefonnummern'} numSelected={0} addAction={() => this.handleAdd(arrayHelpers)} />
            <Table padding={'dense'} style={{ minWidth: '1000px' }}>
              <TableHead>
                <TableRow>
                  <DimeTableCell style={{ width: '40%' }}>Kategorie</DimeTableCell>
                  <DimeTableCell style={{ width: '40%' }}>Nummer</DimeTableCell>
                  <DimeTableCell style={{ width: '20%' }}>Aktionen</DimeTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(values.phone_numbers ? values.phone_numbers : []).map(
                  (phoneNumber: PhoneNumber & { formikKey?: number }, index: number) => {
                    const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                    return (
                      <TableRow key={phoneNumber.id || phoneNumber.formikKey}>
                        <DimeTableCell>
                          <DimeField delayed portal component={Select} name={name('category')} margin={'none'} options={this.options} />
                        </DimeTableCell>
                        <DimeTableCell>
                          <DimeField delayed component={TextField} name={name('number')} margin={'none'} />
                        </DimeTableCell>
                        <DimeTableCell>
                          <DeleteButton onConfirm={() => arrayHelpers.remove(index)} />
                        </DimeTableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </DimePaper>
        )}
      />
    );
  }
}
