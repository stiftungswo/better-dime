import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { FieldArray, FormikProps, getIn } from 'formik';
import { observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { ProjectCategorySelect } from '../../form/entitySelect/ProjectCategorySelect';
import {NumberField, possiblyIntlError, TextField} from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ConfirmationButton } from '../../layout/ConfirmationDialog';
import { DimeTableCell } from '../../layout/DimeTableCell';
import { ErrorText } from '../../layout/ErrorText';
import TableToolbar from '../../layout/TableToolbar';
import { MainStore } from '../../stores/mainStore';
import { Offer, OPCategory, Project, ProjectCategory } from '../../types';
import compose from '../../utilities/compose';

const template = () => ({
  category_id: '',
  formikKey: Math.random(),
  weight: 100,
});

export interface Props<OP extends Offer | Project, TYPE extends string> {
  mainStore?: MainStore;
  intl?: IntlShape;
  formikProps: FormikProps<OP>;
  name: string;
  disabled?: boolean;
  type: TYPE;
}

@compose(
  injectIntl,
  observer,
)
export class CategorySubform<OP extends Offer | Project, TYPE extends string> extends React.Component<Props<OP, TYPE> > {
  render() {
    const { values, errors, touched } = this.props.formikProps;
    const { disabled, name } = this.props;
    const category_distributions: OPCategory[] = values.category_distributions;
    const currentError = getIn(touched, name) && getIn(errors, name);
    const intl = this.props.intl!;
    const idPrefix = 'view.project.category_subform';

    const showFraction = this.props.type === 'Project';
    const uncategorizedDistribution = showFraction ? values.uncategorized_distribution : null;
    const widths = showFraction ? { fraction: '25%', category: '60%', actions: '15%' } : { fraction: '0%', category: '75%', actions: '25%' };

    return (
      <FieldArray
        name={name}
        render={arrayHelpers => (
          <>
            <TableToolbar
              title={intl.formatMessage({id: 'general.project_category.plural'})}
              error={Boolean(currentError)}
              addAction={disabled ? undefined : () => arrayHelpers.push(template())}
            />
            <Table>
              <TableHead>
                <TableRow>
                  {widths.fraction !== '0%' && <DimeTableCell style={{ width: widths.fraction }}> <FormattedMessage id={idPrefix + '.fraction'} /> </DimeTableCell>}
                  <DimeTableCell style={{ width: widths.category }}> <FormattedMessage id={'general.project_category'} /> </DimeTableCell>
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
                {category_distributions.map((p: ProjectCategory & { formikKey?: number }, index: number) => {
                  const fieldName = (field: string) => `${this.props.name}.${index}.${field}`;
                  return (
                    <TableRow key={p.category_id || p.formikKey}>
                      {widths.fraction !== '0%' && <DimeTableCell>{p?.distribution?.toFixed(2) ?? 0}%</DimeTableCell>}
                      <DimeTableCell>
                        <DimeField component={ProjectCategorySelect} name={fieldName('category_id')} />
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
                      <p>Aufwände ohne Tätigkeitsbereiche</p>
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
export class OfferCategorySubform extends CategorySubform<Offer, 'Offer'> {}
export class ProjectCategorySubform extends CategorySubform<Project, 'Project'> {}
