import { TextField } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { EffortStore } from '../../../stores/effortStore';
import { ProjectPosition } from '../../../types';
import compose from '../../../utilities/compose';
import { DimeCustomFieldProps } from '../common';
import { FlatEffortValueField } from './FlatEffortValueField';
import { TimeEffortValueField } from './TimeEffortValueField';

interface Props extends DimeCustomFieldProps<number> {
  rateUnitId: number;
  positionId?: number;
  effortStore?: EffortStore;
}

@compose(
  inject('effortStore'),
  observer,
)
export class EffortValueField extends React.Component<Props> {
  render() {
    const { positionId } = this.props;
    const { selectedProject } = this.props.effortStore!;

    if (positionId && selectedProject) {
      const selectedPosition: ProjectPosition | undefined = selectedProject!.positions.find((p: ProjectPosition) => p.id === positionId);

      if (selectedPosition) {
        if (selectedPosition.is_time) {
          return <TimeEffortValueField rateUnitId={selectedPosition.rate_unit_id} {...this.props} />;
        } else {
          return <FlatEffortValueField rateUnitId={selectedPosition.rate_unit_id} {...this.props} />;
        }
      } else {
        return <TextField label={'Ausgewählte Position nicht gefunden.'} disabled />;
      }
    } else {
      return <TextField label={'Kein Projekt oder Aktivität ausgewählt.'} disabled />;
    }
  }
}
