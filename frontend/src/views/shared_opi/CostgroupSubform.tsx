import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { FieldArray, FormikProps, getIn } from 'formik';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import CostgroupSelect from '../../form/entitySelect/CostgroupSelect';
import { NumberField, possiblyIntlError } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ConfirmationButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { ErrorText } from '../../layout/ErrorText';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import { Invoice, Offer, OPICostgroup, Project } from '../../types';
import compose from '../../utilities/compose';

const template = () => ({
  costgroup_number: '',
  formikKey: Math.random(),
  weight: 100,
});

export interface Props<OPI extends Offer | Project | Invoice> {
  mainStore?: MainStore;
  intl?: IntlShape;
  formikProps: FormikProps<OPI>;
  name: string;
  disabled?: boolean;
}

@compose(
  injectIntl,
  observer,
)
class CostgroupSubform<OPI extends Offer | Project | Invoice> extends React.Component<Props<OPI>> {
  render() {
    const { values, errors, touched } = this.props.formikProps;
    const { disabled, name } = this.props;
    // avoid triggering https://github.com/microsoft/TypeScript/issues/33591
    const costgroup_distributions: OPICostgroup[] = values.costgroup_distributions;
    const weightSum = costgroup_distributions.map(d => d.weight).reduce((a: number, b: number) => a + b, 0);
    const currentError = getIn(touched, name) && getIn(errors, name);
    const idPrefix = 'view.project.costgroup_subform';
    const intl = this.props.intl!;
    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <>
            <TableToolbar
              title={intl.formatMessage({id: 'general.cost_group.plural'})}
              error={Boolean(currentError)}
              addAction={disabled ? undefined : () => arrayHelpers.push(template())}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <DimeTableCell style={{ width: '20%' }}> <FormattedMessage id={idPrefix + '.weight'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}> <FormattedMessage id={idPrefix + '.fraction'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: '50%' }}> <FormattedMessage id={'general.cost_group'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: '15%' }}> <FormattedMessage id={'general.actions'} /> </DimeTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {typeof currentError === 'string' && (
                  <TableRow>
                    <DimeTableCell colSpan={4}>
                      <ErrorText>{possiblyIntlError(intl, currentError)}</ErrorText>
                    </DimeTableCell>
                  </TableRow>
                )}
                {costgroup_distributions.map((p: OPICostgroup & { formikKey?: number }, index: number) => {
                  const fieldName = (field: string) => `${this.props.name}.${index}.${field}`;
                  const distribution = ((p.weight / weightSum) * 100).toFixed(0);
                  return (
                    <TableRow key={p.id || p.formikKey}>
                      <DimeTableCell>
                        <DimeField delayed component={NumberField} name={fieldName('weight')} />
                      </DimeTableCell>
                      <DimeTableCell>{distribution}%</DimeTableCell>
                      <DimeTableCell>
                        <DimeField component={CostgroupSelect} name={fieldName('costgroup_number')} />
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
// tslint:disable:max-classes-per-file
export class OfferCostgroupSubform extends CostgroupSubform<Offer> {}
export class ProjectCostgroupSubform extends CostgroupSubform<Project> {}
export class InvoiceCostgroupSubform extends CostgroupSubform<Invoice> {}