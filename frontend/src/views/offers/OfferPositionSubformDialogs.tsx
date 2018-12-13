// This is currently unused until we implement responsive form switching. See #31
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import compose from '../../utilities/compose';
import { MainStore } from '../../stores/mainStore';
import TableToolbar from '../../layout/TableToolbar';
import { Offer, OfferPosition } from '../../types';
import { Field, FieldArray, FormikProps } from 'formik';

import { ServiceSelector } from '../../form/entitySelector/ServiceSelector';
import { SubformTable } from '../../layout/SubformTable';
import { Column } from '../../layout/Overview';
import { NumberField } from '../../form/fields/common';
import { RateUnitSelector } from '../../form/entitySelector/RateUnitSelector';
import PercentageField from '../../form/fields/PercentageField';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { ServiceStore } from '../../stores/serviceStore';
import { computed } from 'mobx';
import CurrencyField from '../../form/fields/CurrencyField';

const template = {
  amount: '',
  order: 1,
  price_per_rate: '',
  rate_unit_id: '',
  vat: 0.077, // this should probably be configurable somewhere; user settings?
};

export interface Props {
  mainStore?: MainStore;
  formikProps: FormikProps<Offer>;
  name: string;
  serviceStore?: ServiceStore;
  rateUnitStore?: RateUnitStore;
}

@compose(
  inject('serviceStore', 'rateUnitStore'),
  observer
)
export default class OfferPositionSubformDialogs extends React.Component<Props> {
  @computed
  public get columns(): Array<Column<OfferPosition>> {
    const { serviceStore, rateUnitStore, mainStore } = this.props;
    return [
      {
        id: 'order',
        numeric: false,
        label: 'Reihenfolge',
      },
      {
        id: 'service_id',
        numeric: false,
        label: 'Service',
        format: ({ service_id }) => {
          const service = serviceStore!.services.find(s => s.id === service_id);
          return service ? service.name : service_id;
        },
      },
      {
        id: 'price_per_rate',
        numeric: false,
        label: 'Tarif',
        format: p => mainStore!.formatCurrency(p.price_per_rate),
      },
      {
        id: 'rate_unit_id',
        numeric: false,
        label: 'Tariftyp',
        format: ({ rate_unit_id }) => {
          const id = rate_unit_id;
          const rateUnit = rateUnitStore!.rateUnits.find(s => s.id === id);
          return rateUnit ? rateUnit.effort_unit : id;
        },
      },
      {
        id: 'amount',
        numeric: true,
        label: 'Menge',
      },
      {
        id: 'vat',
        numeric: true,
        label: 'MwSt',
        format: ({ vat }) => (vat * 100).toFixed(2) + ' %',
      },
      {
        id: 'total',
        numeric: true,
        label: 'Total',
        format: p => mainStore!.formatCurrency(p.amount * p.price_per_rate * (1 + p.vat)),
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
              values={values.positions}
              columns={this.columns}
              defaultValues={template}
              renderForm={(index: number) => {
                const name = (fieldName: string) => `${this.props.name}.${index}.${fieldName}`;
                const p = values.positions[index] as OfferPosition;
                const total = p.amount * p.price_per_rate * (1 + p.vat);

                return (
                  <>
                    <div>
                      <Field component={NumberField} label={'Reihenfolge'} name={name('order')} />
                    </div>
                    <div>
                      <Field component={ServiceSelector} label={'Service'} name={name('service_id')} />
                    </div>
                    <div>
                      <Field component={CurrencyField} label="Tarif" name={name('price_per_rate')} />
                    </div>
                    <div>
                      <Field disabled component={RateUnitSelector} label="Einheit" name={name('rate_unit_id')} />
                    </div>
                    <div>
                      <Field component={NumberField} label="Menge" name={name('amount')} />
                    </div>
                    <div>
                      <Field component={PercentageField} label="MwSt." name={name('vat')} />
                    </div>
                    <br />
                    <div>Total: {this.props.mainStore!.formatCurrency(total)}</div>
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
