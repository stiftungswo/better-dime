import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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

export interface Props<OPI extends Offer | Project | Invoice, TYPE extends 'Offer' | 'Project' | 'Invoice'> {
  mainStore?: MainStore;
  intl?: IntlShape;
  formikProps: FormikProps<OPI>;
  name: string;
  disabled?: boolean;
  type: TYPE;
}

@compose(
  injectIntl,
  observer,
)
class CostgroupSubform<OPI extends Offer | Project | Invoice, TYPE extends 'Offer' | 'Project' | 'Invoice'> extends React.Component<Props<OPI, TYPE>> {
  render() {
    const { values, errors, touched } = this.props.formikProps;
    const { disabled, name } = this.props;
    // avoid triggering https://github.com/microsoft/TypeScript/issues/33591
    const costgroup_distributions: OPICostgroup[] = values.costgroup_distributions;
    const currentError = getIn(touched, name) && getIn(errors, name);
    const idPrefix = 'view.project.costgroup_subform';
    const intl = this.props.intl!;

    const showFraction = this.props.type === 'Project' || this.props.type === 'Invoice';
    const uncategorizedDistribution = showFraction ? values.costgroup_uncategorized_distribution : null;

    const showWeightInput = this.props.type === 'Invoice';

    let widths = {fraction: '0%', input: '0%', category: '75%', actions: '25%'};
    if (showFraction) {
      if (showWeightInput) {
        widths = {fraction: '15%', input: '20%', category: '50%', actions: '15%'};
      } else {
        widths = {fraction: '25%', input: '0%', category: '60%', actions: '15%'};
      }
    }

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
                  {widths.fraction !== '0%' && <DimeTableCell style={{ width: widths.fraction }}> <FormattedMessage id={idPrefix + '.fraction'} /> </DimeTableCell>}
                  {widths.input !== '0%' && <DimeTableCell style={{ width: widths.input }}> <FormattedMessage id={idPrefix + '.weight'} /> </DimeTableCell>}
                  <DimeTableCell style={{ width: widths.category }}> <FormattedMessage id={'general.cost_group'} /> </DimeTableCell>
                  <DimeTableCell style={{ width: widths.actions }}> <FormattedMessage id={'general.actions'} /> </DimeTableCell>
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
                  return (
                    <TableRow key={p.id || p.formikKey}>
                      {widths.fraction !== '0%' && <DimeTableCell>{p?.distribution?.toFixed(2) ?? 0}%</DimeTableCell>}
                      {showWeightInput && (
                          <DimeTableCell>
                            <DimeField delayed component={NumberField} name={fieldName('weight')} />
                          </DimeTableCell>
                        )
                      }
                      <DimeTableCell>
                        <DimeField component={CostgroupSelect} name={fieldName('costgroup_number')} />
                      </DimeTableCell>
                      <DimeTableCell>
                        <ConfirmationButton onConfirm={() => arrayHelpers.remove(index)} disabled={disabled} />
                      </DimeTableCell>
                    </TableRow>
                  );
                })}
                {uncategorizedDistribution !== undefined && uncategorizedDistribution !== null && <>
                  <TableRow key={'uncategorized_distribution'}>
                    {widths.fraction !== '0%' && <DimeTableCell>{uncategorizedDistribution.toFixed(2) ?? 0}%</DimeTableCell>}
                    <DimeTableCell>
                      <p><FormattedMessage id={'view.project.costgroup_subform.effors_without_cost_group'} /></p>
                    </DimeTableCell>
                    <DimeTableCell/>
                  </TableRow>
                </>}
              </TableBody>
            </Table>
          </>
        )}
      />
    );
  }
}
// tslint:disable:max-classes-per-file
export class OfferCostgroupSubform extends CostgroupSubform<Offer, 'Offer'> {}
export class ProjectCostgroupSubform extends CostgroupSubform<Project, 'Project'> {}
export class InvoiceCostgroupSubform extends CostgroupSubform<Invoice, 'Invoice'> {}
