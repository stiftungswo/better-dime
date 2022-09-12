import { Grid, TextField } from '@mui/material';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { LoadingSpinner } from '../../../layout/LoadingSpinner';
import { MainStore } from '../../../stores/mainStore';
import { RateUnitStore } from '../../../stores/rateUnitStore';
import { RateUnit } from '../../../types';
import compose from '../../../utilities/compose';
import { wrapIntl } from '../../../utilities/wrapIntl';
import { DimeCustomFieldProps } from '../common';
import Select from '../Select';

interface Props extends DimeCustomFieldProps<number> {
  mainStore?: MainStore;
  rateUnitId: number;
  rateUnitStore?: RateUnitStore;
  intl?: IntlShape;
}

interface State {
  rateUnits: RateUnit[];
  rateUnitId: number;
  selectedFactor: number;
  value: number;
  is_loading: boolean;
}

@compose(
  injectIntl,
  inject('mainStore', 'rateUnitStore'),
  observer,
)
export class TimeEffortValueField extends React.Component<Props> {
  state: State = {
    rateUnits: [],
    rateUnitId: this.props.rateUnitId || 1,
    selectedFactor: 60,
    value: this.props.value || 504,
    is_loading: true,
  };

  async componentDidMount() {
    let futureState = { ...this.state, is_loading: false };

    futureState.rateUnits = this.props.rateUnitStore!.rateUnits!.filter((r: RateUnit) => r.is_time);

    const potentialRateUnit = this.props.rateUnitStore!.rateUnits!.find((r: RateUnit) => r.id === futureState.rateUnitId);

    if (potentialRateUnit) {
      futureState = { ...futureState, rateUnitId: potentialRateUnit.id, selectedFactor: potentialRateUnit.factor };
    }

    if (this.props.value && potentialRateUnit) {
      futureState.value = this.props.value === 1 ? 1 : this.props.value / potentialRateUnit.factor;
    }
    this.props.onChange(futureState.selectedFactor * futureState.value);
    this.setState(futureState);
  }

  render() {
    const intlText = wrapIntl(this.props.intl!, 'form.fields.timetrack.time_effort_value_field');
    if (!this.state.is_loading) {
      return (
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={9}>
            <TextField
              variant="standard"
              fullWidth
              label={intlText('general.value', true)}
              value={this.state.value}
              onChange={e => this.updateValue(e.target.value, intlText)}
              style={{ marginTop: '16px', marginBottom: '8px' }}
              inputProps={{ step: '0.01' }}
            />
          </Grid>
          <Grid item xs={3}>
            <Select
              options={this.options()}
              label={intlText('time_unit')}
              value={this.state.rateUnitId}
              onChange={(id: number) => this.updateSelectedRateUnit(id, intlText)}
            />
          </Grid>
        </Grid>
      );
    } else {
      return <LoadingSpinner />;
    }
  }

  protected options() {
    return this.state
      .rateUnits!.filter((e: RateUnit) => !e.archived || this.props.value === e.id)
      .map(e => ({
        value: e.id,
        label: e.effort_unit,
      }));
  }

  protected updateSelectedRateUnit = (id: number, intlText: any) => {
    const selectedRateUnit = this.state.rateUnits.find((r: RateUnit) => r.id === id);
    const previousRateUnit = this.state.rateUnits.find((r: RateUnit) => r.id === this.state.rateUnitId);
    const previousValue = this.state.value;

    if (selectedRateUnit && previousRateUnit) {
      const newValue = previousValue * (previousRateUnit.factor / selectedRateUnit.factor);

      this.props.onChange(selectedRateUnit.factor * newValue);

      this.setState({
        rateUnitId: selectedRateUnit.id,
        selectedFactor: selectedRateUnit.factor,
        value: newValue,
      });
    } else {
      throw new Error(intlText('select_error_message'));
    }
  }

  protected updateValue = (value: string, intlText: any) => {
    const parsedValue: number = Number(value);

    if (isNaN(parsedValue)) {
      this.props.mainStore!.displayInfo(intlText('invalid_number_warning'), {
        autoHideDuration: 6000,
      });
    } else {
      this.props.onChange(this.state.selectedFactor * parsedValue);
      this.setState({ value });
    }
  }
}
