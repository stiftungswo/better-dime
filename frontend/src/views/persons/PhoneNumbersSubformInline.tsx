import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
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
import { wrapIntl } from '../../utilities/wrapIntl';

export interface Props {
  mainStore?: MainStore;
  peopleStore?: PeopleStore;
  intl?: IntlShape;
  formikProps: FormikProps<Person | Company>;
  name: string;
  disabled?: boolean;
  inherited?: PhoneNumber[];
}

@compose(
  inject('mainStore', 'peopleStore'),
  observer,
  injectIntl,
)
export default class PhoneNumberSubformInline extends React.Component<Props> {
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
    const idPrefix = 'view.person.phone_number_subform_inline';
    const intlText = wrapIntl(this.props.intl!, idPrefix);

    const options = [
      { value: 1, label: intlText('main_number') },
      { value: 2, label: intlText('direct_dial') },
      { value: 3, label: intlText('private') },
      { value: 4, label: intlText('mobile') },
      { value: 5, label: intlText('fax') },
    ];

    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <DimePaper>
            <TableToolbar title={'Telefonnummern'} numSelected={0} addAction={() => this.handleAdd(arrayHelpers)} />
            <Table size="small" style={{ minWidth: '1000px' }}>
              <TableHead>
                <TableRow>
                  <DimeTableCell style={{ width: '40%' }}> <FormattedMessage id={idPrefix + '.category'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: '40%' }}> <FormattedMessage id={idPrefix + '.number'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: '20%' }}> <FormattedMessage id={'general.actions'} /> </DimeTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inherited.map((phoneNumber: PhoneNumber) => {
                  const category = options.find(o => o.value === phoneNumber.category);
                  return (
                    <TableRow key={phoneNumber.id}>
                      <DimeTableCell>{category ? category.label : '?'}</DimeTableCell>
                      <DimeTableCell>{phoneNumber.number}</DimeTableCell>
                      <DimeTableCell> <FormattedMessage id={idPrefix + '.from_company'} /> </DimeTableCell>
                    </TableRow>
                  );
                })}
                {(values.phone_numbers ? values.phone_numbers : []).map(
                  (phoneNumber: PhoneNumber & { formikKey?: number }, index: number) => {
                    const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                    return (
                      <TableRow key={phoneNumber.id || phoneNumber.formikKey}>
                        <DimeTableCell>
                          <DimeField delayed component={Select} name={name('category')} margin={'none'} options={options} />
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
