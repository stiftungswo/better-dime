import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { NumberField, SwitchField, TextField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { EditableOverview } from '../../layout/EditableOverview';
import { Column } from '../../layout/Overview';
import { LocationStore } from '../../stores/locationStore';
import { MainStore } from '../../stores/mainStore';
import { Location } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import { locationSchema, locationTemplate } from './locationSchema';

interface Props {
  mainStore?: MainStore;
  locationStore?: LocationStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore', 'locationStore'),
  observer,
)
export default class LocationOverview extends React.Component<Props> {
  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.location.overview');
    const locationStore = this.props.locationStore;
    const columns: Array<Column<Location>> = [
      {
        id: 'order',
        numeric: false,
        label: intlText('sorting_order'),
        defaultSort: 'asc',
      },
      {
        id: 'name',
        numeric: false,
        label: intlText('general.name', true),
        format: e => e.name + (e.archived ? ' [A]' : ''),
      },
      {
        id: 'url',
        numeric: false,
        label: 'url',
      },
    ];

    return (
      <EditableOverview
        archivable
        searchable
        title={intlText('general.location.plural', true)}
        store={locationStore!}
        columns={columns}
        schema={locationSchema}
        defaultValues={locationTemplate}
        renderActions={(e: Location) => (
          <ActionButtons
            archiveAction={!e.archived ? () => locationStore!.archive(e.id, true) : undefined}
            restoreAction={e.archived ? () => locationStore!.archive(e.id, false) : undefined}
          />
        )}
        renderForm={() => (
          <>
            <DimeField component={TextField} required name={'name'} label={intlText('general.name', true)} />
            <DimeField component={TextField} name={'url'} label={'url'} />
            <DimeField component={NumberField} required name={'order'} label={intlText('sorting_order')} />
            <DimeField component={SwitchField} name={'archived'} label={intlText('general.is_archived', true)} />
          </>
        )}
      />
    );
  }
}
