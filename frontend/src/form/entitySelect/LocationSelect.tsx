import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { LocationStore } from '../../stores/locationStore';
import { Location } from '../../types';
import compose from '../../utilities/compose';
import Select, { DimeSelectFieldProps } from '../fields/Select';

// TODO can we use conditional types to deal with isMulti?
interface Props<T = number> extends DimeSelectFieldProps<T> {
  locationStore?: LocationStore;
}

@compose(
  inject('locationStore'),
  observer,
)
export class LocationSelect<T> extends React.Component<Props<T>> {
  get options() {
    const locations = this.props
      .locationStore!.entities.filter((e: Location) => !e.archived)
      // put employees before zivis, as the former are used way more in timetrack.
      .sort((e, f) => e.order - f.order)
      .map(e => ({
        value: e.id,
        label: e.name,
      }));
    return [{value: null, label: '<Nachfragen>'}, ...locations];
  }

  render() {
    return <Select options={this.options} {...this.props} />;
  }
}
