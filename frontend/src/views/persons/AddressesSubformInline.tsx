import * as React from 'react';
import { ArrayHelpers, FieldArray, FormikProps, Field } from 'formik';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { Address } from '../../types';
import { MainStore } from '../../stores/mainStore';
import TableToolbar from '../../layout/TableToolbar';
import { Person, PeopleStore } from 'src/stores/peopleStore';
import { DeleteButton } from 'src/layout/ConfirmationDialog';
import { NumberField, TextField } from 'src/form/fields/common';
import { DimePaper } from '../../layout/DimePaper';

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
export default class AddressesSubformInline extends React.Component<Props> {
  public handleAdd = (arrayHelpers: ArrayHelpers) => {
    arrayHelpers.push({
      street: '',
      postcode: 0,
      city: '',
      country: '',
      supplement: '',
      description: '',
    });
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
                  <TableCell style={{ width: '20%' }}>Strasse</TableCell>
                  <TableCell style={{ width: '15%' }}>Addresszusatz</TableCell>
                  <TableCell style={{ width: '10%' }}>PLZ</TableCell>
                  <TableCell style={{ width: '15%' }}>Stadt</TableCell>
                  <TableCell style={{ width: '15%' }}>Land</TableCell>
                  <TableCell style={{ width: '30%' }}>Kommentar</TableCell>
                  <TableCell style={{ width: '15%' }}>Aktionen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(values.addresses ? values.addresses : []).map((a: Address, index: number) => {
                  const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Field delayed component={TextField} name={name('street')} margin={'none'} />
                      </TableCell>
                      <TableCell>
                        <Field delayed component={TextField} name={name('supplement')} margin={'none'} />
                      </TableCell>
                      <TableCell>
                        <Field delayed component={NumberField} name={name('postcode')} margin={'none'} />
                      </TableCell>
                      <TableCell>
                        <Field delayed component={TextField} name={name('city')} margin={'none'} />
                      </TableCell>
                      <TableCell>
                        <Field delayed component={TextField} name={name('country')} margin={'none'} />
                      </TableCell>
                      <TableCell>
                        <Field delayed component={TextField} name={name('description')} margin={'none'} multiline={true} />
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
