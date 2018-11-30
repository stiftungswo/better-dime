import React from 'react';
import { InputFieldProps } from '../common';
import compose from '../../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { EffortStore } from '../../../stores/effortStore';
import { ProjectPosition } from '../../../types';
import { TextField } from '@material-ui/core';
import { FlatEffortValueField } from './FlatEffortValueField';
import { TimeEffortValueField } from './TimeEffortValueField';

interface Props extends InputFieldProps {
  rateUnitId: number;
  effortStore?: EffortStore;
}

@compose(
  inject('effortStore'),
  observer
)
export class EffortValueField extends React.Component<Props> {
  public render() {
    const { position_id } = this.props.form.values;
    const { selectedProject } = this.props.effortStore!;

    if (position_id && selectedProject) {
      const selectedPosition: ProjectPosition | undefined = selectedProject!.positions.find((p: ProjectPosition) => p.id === position_id);

      if (selectedPosition) {
        if (selectedPosition.is_time) {
          return <TimeEffortValueField rateUnitId={selectedPosition.rate_unit_id} {...this.props} />;
        } else {
          return <FlatEffortValueField rateUnitId={selectedPosition.rate_unit_id} {...this.props} />;
        }
      } else {
        return <TextField label={'Ausgewählte Position nicht gefunden.'} disabled fullWidth />;
      }
    } else {
      return <TextField label={'Kein Projekt oder Aktivität ausgewählt.'} disabled fullWidth />;
    }
  }
}
