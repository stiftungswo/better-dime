import * as React from 'react';
import { ArrayHelpers, FieldArray, FormikProps, Field } from 'formik';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Address, PhoneNumber } from '../../types';
import { MainStore } from '../../stores/mainStore';
import TableToolbar from '../../layout/TableToolbar';
import { Person, PeopleStore } from 'src/stores/peopleStore';
import { DeleteButton } from 'src/layout/ConfirmationDialog';
import { NumberField, TextField } from 'src/form/fields/common';
import Select from 'src/form/fields/Select';
import { DimePaper } from '../../layout/DimeLayout';

export interface Props {
  mainStore?: MainStore;
  peopleStore?: PeopleStore;
  formikProps: FormikProps<Person>;
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
      category: 0,
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
                  <TableCell style={{ width: '40%' }}>Kategorie</TableCell>
                  <TableCell style={{ width: '40%' }}>Nummer</TableCell>
                  <TableCell style={{ width: '20%' }}>Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(values.phone_numbers ? values.phone_numbers : []).map((_: PhoneNumber, index: number) => {
                  const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Field delayed portal component={Select} name={name('category')} margin={'none'} options={this.options} />
                      </TableCell>
                      <TableCell>
                        <Field delayed component={TextField} name={name('number')} margin={'none'} />
                      </TableCell>
                      <TableCell>
                        <DeleteButton onConfirm={() => arrayHelpers.remove(index)} />
                      </TableCell>
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
