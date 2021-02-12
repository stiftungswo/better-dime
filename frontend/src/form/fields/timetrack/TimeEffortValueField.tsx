import { Grid, TextField } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { LoadingSpinner } from '../../../layout/LoadingSpinner';
import { MainStore } from '../../../stores/mainStore';
import { RateUnitStore } from '../../../stores/rateUnitStore';
import { RateUnit } from '../../../types';
import compose from '../../../utilities/compose';
import { DimeCustomFieldProps } from '../common';
import Select from '../Select';

interface Props extends DimeCustomFieldProps<number> {
  mainStore?: MainStore;
  rateUnitId: number;
  rateUnitStore?: RateUnitStore;
}

interface State {
  rateUnits: RateUnit[];
  rateUnitId: number;
  selectedFactor: number;
  value: number;
  is_loading: boolean;
}

@compose(
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
    if (!this.state.is_loading) {
      return (
        <Grid container alignItems="center" spacing={8}>
          <Grid item xs={9}>
            <TextField
              fullWidth
              label={'Wert'}
              value={this.state.value}
              onChange={e => this.updateValue(e.target.value)}
              style={{ marginTop: '16px', marginBottom: '8px' }}
              inputProps={{ step: '0.01' }}
            />
          </Grid>
          <Grid item xs={3}>
            <Select
              options={this.options()}
              portal
              label={'Zeiteinheit'}
              value={this.state.rateUnitId}
              onChange={(id: number) => this.updateSelectedRateUnit(id)}
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

  protected updateSelectedRateUnit = (id: number) => {
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
      throw new Error('Das Select-Field liefert einen Wert zurück, welcher nicht vorhanden war in den ursprünglichen Optionen!');
    }
  }

  protected updateValue = (value: string) => {
    const parsedValue: number = Number(value);

    if (isNaN(parsedValue)) {
      this.props.mainStore!.displayInfo('Achtung: Es können nur ganze Zahlen (z.B. 8) oder Zahlen, welche mit einem Dezimalpunkt ' +
        'getrennt sind (z.B. 8.5), eingegeben werden! Falls keine gültige Zahl eingegeben wird, ' +
        'kann der Eintrag nicht gespeichert werden!', {
        autoHideDuration: 6000,
      });
    } else {
      this.props.onChange(this.state.selectedFactor * parsedValue);
      this.setState({ value });
    }
  }
}
