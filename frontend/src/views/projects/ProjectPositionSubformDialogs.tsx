import * as React from 'react';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { MainStore } from '../../stores/mainStore';
import TableToolbar from '../../layout/TableToolbar';
import { Project, ProjectPosition } from '../../types';
import { ErrorMessage, Field, FieldArray, FormikProps, getIn } from 'formik';

import { ServiceSelector } from '../../form/entitySelector/ServiceSelector';
import { SubformTable } from '../../layout/SubformTable';
import { Column } from '../../layout/Overview';
import { TextField } from '../../form/fields/common';
import { RateUnitSelector } from '../../form/entitySelector/RateUnitSelector';
import PercentageField from '../../form/fields/PercentageField';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ServiceStore } from '../../stores/serviceStore';
import { computed } from 'mobx';
import CurrencyField from '../../form/fields/CurrencyField';
import { Formatter } from '../../utilities/formatter';

const template = {
  description: '',
  service_id: '',
  price_per_rate: 0,
  rate_unit_id: '',
  vat: 0.077, // this should probably be configurable somewhere; user settings?
};

export interface Props {
  formatter?: Formatter;
  formikProps: FormikProps<Project>;
  name: string;
  serviceStore?: ServiceStore;
  rateUnitStore?: RateUnitStore;
}

@compose(
  inject('formatter', 'serviceStore', 'rateUnitStore'),
  observer
)
export default class ProjectPositionSubformDialogs extends React.Component<Props> {
  @computed
  public get columns(): Array<Column<ProjectPosition>> {
    const { serviceStore, rateUnitStore, formatter } = this.props;
    return [
      {
        id: 'service',
        numeric: false,
        label: 'Service',
        format: ({ service_id }) => {
          const service = serviceStore!.services.find(s => s.id === service_id);
          return service ? service.name : service_id;
        },
      },
      {
        id: 'description',
        label: 'Beschreibung',
      },
      {
        id: 'price_per_rate',
        numeric: true,
        label: 'Tarif',
        format: p => formatter!.formatCurrency(p.price_per_rate),
      },
      {
        id: 'efforts_value_with_unit',
        numeric: true,
        label: 'Anzahl',
      },
    ];
  }

  public render() {
    const { values } = this.props.formikProps;

    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => (
          <>
            <TableToolbar title={'Services'} numSelected={0} addAction={() => arrayHelpers.push(template)} />
            <SubformTable
              title={'Services'}
              name={this.props.name}
              formikProps={this.props.formikProps}
              columns={this.columns}
              defaultValues={template}
              renderForm={(index, name) => {
                const p = values.positions[index] as any;
                const total = p.amount * p.price_per_rate * (1 + p.vat);

                return (
                  <>
                    {/*TODO service should not be editable in existing entities; */}
                    {/*in new entities, selecting it should prefill tarif, einheit, mwst - maybe use a wizard flow? */}
                    <div>
                      <Field component={ServiceSelector} label={'Service'} name={name('service_id')} />
                    </div>
                    <div>
                      <Field component={TextField} label={'Beschreibung'} name={name('description')} />
                    </div>
                    <div>
                      <Field component={CurrencyField} label="Tarif" name={name('price_per_rate')} />
                    </div>
                    <div>
                      <Field disabled component={RateUnitSelector} label="Einheit" name={name('rate_unit_id')} />
                    </div>
                    <div>
                      <Field component={PercentageField} label="MwSt." name={name('vat')} />
                    </div>
                  </>
                );
              }}
            />
          </>
        )}
      />
    );
  }
}
