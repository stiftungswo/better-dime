import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
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
import { wrapIntl } from '../../utilities/wrapIntl';

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
  intl?: IntlShape;
  formikProps: FormikProps<Person | Company>;
  name: string;
  disabled?: boolean;
  inherited?: Address[];
  hideable?: boolean;
}

@compose(
  injectIntl,
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
    const idPrefix = 'view.person.addresses_subform_inline';
    const intlText = wrapIntl(this.props.intl!, idPrefix);
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <DimePaper>
            <TableToolbar title={intlText('addresses')} numSelected={0} addAction={() => this.handleAdd(arrayHelpers)} />
            <Table size="small" style={{ minWidth: '1000px' }}>
              <TableHead>
                <TableRow>
                  <DimeTableCell style={{ width: '20%' }}> <FormattedMessage id={idPrefix + '.street'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}> <FormattedMessage id={idPrefix + '.supplement'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: '10%' }}> <FormattedMessage id={idPrefix + '.zip'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}> <FormattedMessage id={idPrefix + '.city'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}> <FormattedMessage id={idPrefix + '.country'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: '30%' }}> <FormattedMessage id={idPrefix + '.description'} /> </DimeTableCell>
                  {hideable && <DimeTableCell style={{ width: '15%' }}> <FormattedMessage id={idPrefix + '.hidden'} /> </DimeTableCell>}
                  <DimeTableCell style={{ width: '15%' }}> <FormattedMessage id={'general.actions'} /> </DimeTableCell>
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
                    <DimeTableCell> <FormattedMessage id={idPrefix + '.from_company'} /> </DimeTableCell>
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
