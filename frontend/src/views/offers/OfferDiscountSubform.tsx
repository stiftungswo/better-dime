import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { FieldArray, FormikProps } from 'formik';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import CurrencyField from '../../form/fields/CurrencyField';
import { DimeField } from '../../form/fields/formik';
import PercentageField from '../../form/fields/PercentageField';
import { ConfirmationButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import { Offer, OfferDiscount } from '../../types';
import compose from '../../utilities/compose';

const template = () => ({
  formikKey: Math.random(),
  name: '',
  percentage: false,
  value: 0,
});

export interface Props {
  mainStore?: MainStore;
  intl?: IntlShape;
  formikProps: FormikProps<Offer>;
  name: string;
  disabled?: boolean;
}

@compose(
  injectIntl,
  observer,
)
export default class OfferDiscountSubform extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { values } = this.props.formikProps;
    const { disabled } = this.props;
    const intl = this.props.intl!;
    const idPrefix = 'view.offer.discount_subform';
    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <>
            <TableToolbar title={intl.formatMessage({id: idPrefix + '.title'})} numSelected={0} addAction={disabled ? undefined : () => arrayHelpers.push(template())} />
            <Table>
              <TableHead>
                <TableRow>
                  <DimeTableCell> <FormattedMessage id={'general.name'} /> </DimeTableCell>
                  <DimeTableCell> <FormattedMessage id={idPrefix + '.percentage'} /> </DimeTableCell>
                  <DimeTableCell> <FormattedMessage id={idPrefix + '.discount'} /> </DimeTableCell>
                  <DimeTableCell> <FormattedMessage id={'general.actions'} /> </DimeTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {values.discounts.map((p: OfferDiscount & { formikKey?: number }, index: number) => {
                  const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                  return (
                    <TableRow key={p.id || p.formikKey}>
                      <DimeTableCell>
                        <DimeField delayed component={TextField} name={name('name')} disabled={disabled} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <DimeField component={SwitchField} name={name('percentage')} disabled={disabled} />
                      </DimeTableCell>
                      <DimeTableCell>
                        {p.percentage ? (
                          <DimeField component={PercentageField} unit={'%'} name={name('value')} disabled={disabled} />
                        ) : (
                          <DimeField component={CurrencyField} unit={'CHF'} name={name('value')} disabled={disabled} />
                        )}
                      </DimeTableCell>
                      <DimeTableCell>
                        <ConfirmationButton onConfirm={() => arrayHelpers.remove(index)} disabled={disabled} />
                      </DimeTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      />
    );
  }
}
