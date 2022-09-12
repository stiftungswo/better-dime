import { TextField } from '@mui/material';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { EffortStore } from '../../../stores/effortStore';
import { ProjectPosition } from '../../../types';
import compose from '../../../utilities/compose';
import { wrapIntl } from '../../../utilities/wrapIntl';
import { DimeCustomFieldProps } from '../common';
import { FlatEffortValueField } from './FlatEffortValueField';
import { TimeEffortValueField } from './TimeEffortValueField';

interface Props extends DimeCustomFieldProps<number> {
  rateUnitId: number;
  positionId?: number;
  effortStore?: EffortStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('effortStore'),
  observer,
)
export class EffortValueField extends React.Component<Props> {
  render() {
    const intlText = wrapIntl(this.props.intl!, 'form.fields.timetrack.effort_value_field');
    const { positionId } = this.props;
    const { selectedProject } = this.props.effortStore!;

    if (positionId && selectedProject) {
      const selectedPosition: ProjectPosition | undefined = selectedProject!.positions.find((p: ProjectPosition) => p.id === positionId);

      if (selectedPosition) {
        if (selectedPosition.is_time) {
          return <TimeEffortValueField {...this.props} rateUnitId={selectedPosition.rate_unit_id} />;
        } else {
          return <FlatEffortValueField {...this.props} rateUnitId={selectedPosition.rate_unit_id} />;
        }
      } else {
        return <TextField variant="standard" label={intlText('position_not_found')} disabled />;
      }
    } else {
      return <TextField variant="standard" label={intlText('placeholder')} disabled />;
    }
  }
}
