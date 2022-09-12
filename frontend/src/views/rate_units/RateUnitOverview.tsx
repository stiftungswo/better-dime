import { Grid } from '@mui/material';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { MainStore } from '../../stores/mainStore';
import { RateUnitStore } from '../../stores/rateUnitStore';
import { RateUnit } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { rateUnitSchema, rateUnitTemplate } from './rateUnitSchema';

interface Props {
  mainStore?: MainStore;
  rateUnitStore?: RateUnitStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'rateUnitStore'),
  observer,
)
export default class RateUnitOverview extends React.Component<Props> {
  archiveRateUnit(e: RateUnit, archive: boolean) {
    this.props.rateUnitStore!.archive(e.id, archive).then(() => this.props.rateUnitStore!.fetchAllPaginated());
  }

  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.rate_unit.overview');
    const columns: Array<Column<RateUnit>> = [
      {
        id: 'listing_name',
        numeric: false,
        label: intlText('general.name', true),
      },
      {
        id: 'factor',
        numeric: true,
        label: intlText('factor'),
      },
      {
        id: 'billing_unit',
        numeric: false,
        label: intlText('billing_unit'),
      },
      {
        id: 'effort_unit',
        numeric: false,
        label: intlText('effort_unit'),
      },
      {
        id: 'is_time',
        numeric: false,
        label: intlText('is_time_unit'),
        format: e => (e.is_time ? 'Ja' : 'Nein'),
      },
    ];

    return (
      <EditableOverview
        archivable
        paginated
        searchable
        title={intlText('popup_title')}
        store={this.props.rateUnitStore!}
        columns={columns}
        schema={rateUnitSchema}
        defaultValues={rateUnitTemplate}
        renderActions={(e: RateUnit) => (
          <ActionButtons
            archiveAction={!e.archived ? () => this.archiveRateUnit(e, true) : undefined}
            restoreAction={e.archived ? () => this.archiveRateUnit(e, false) : undefined}
          />
        )}
        renderForm={props => (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DimeField component={TextField} name={'name'} label={intlText('general.name', true)} />
            </Grid>

            <Grid item xs={4}>
              <DimeField component={NumberField} name={'factor'} label={intlText('factor')}/>
            </Grid>

            <Grid item xs={4}>
              <DimeField component={TextField} name={'billing_unit'} label={intlText('billing_unit')} />
            </Grid>

            <Grid item xs={4}>
              <DimeField component={TextField} name={'effort_unit'} label={intlText('effort_unit')} />
            </Grid>

            <Grid item xs={6}>
              <DimeField component={SwitchField} name={'is_time'} label={intlText('is_time_unit')} />
            </Grid>

            <Grid item xs={6}>
              <DimeField component={SwitchField} name={'archived'} label={intlText('general.is_archived', true)} />
            </Grid>
          </Grid>
        )}
      />
    );
  }
}
