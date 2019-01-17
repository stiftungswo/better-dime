import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import Select from '../Select';
import { RateUnitStore } from '../../../stores/rateUnitStore';
import compose from '../../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { LoadingSpinner } from '../../../layout/LoadingSpinner';
import { RateUnit } from '../../../types';
import { DimeCustomFieldProps } from '../common';

interface Props extends DimeCustomFieldProps<number> {
  rateUnitId: number;
  rateUnitStore?: RateUnitStore;
}

interface State {
  rateUnits: RateUnit[];
  rateUnitId: number;
  selectedFactor: number;
  value: number;
}

@compose(
  inject('rateUnitStore'),
  observer
)
export class TimeEffortValueField extends React.Component<Props> {
  public state: State = {
    rateUnits: [],
    rateUnitId: 1,
    selectedFactor: 1,
    value: this.props.value || 1,
  };

  public async componentDidMount() {
    this.setState({
      rateUnits: this.props.rateUnitStore!.rateUnits!.filter((r: RateUnit) => r.is_time),
    });

    const potentialRateUnit = this.props.rateUnitStore!.rateUnits!.find((r: RateUnit) => r.id === this.props.rateUnitId);
    if (potentialRateUnit) {
      this.setState({ rateUnitId: potentialRateUnit.id, selectedFactor: potentialRateUnit.factor });
    }

    if (this.props.value && potentialRateUnit) {
      this.setState({ value: this.props.value / potentialRateUnit.factor });
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

    if (selectedRateUnit) {
      this.setState({
        rateUnitId: selectedRateUnit.id,
        selectedFactor: selectedRateUnit.factor,
        value: (this.state.value * this.state.selectedFactor) / selectedRateUnit.factor,
      });

      this.props.onChange(selectedRateUnit.factor * this.state.value);
    } else {
      throw new Error('Das Select-Field liefert einen Wert zurück, welcher nicht vorhanden war in den ursprünglichen Optionen!');
    }
  };

  protected updateValue = (value: string) => {
    this.setState({ value });
    this.props.onChange(this.state.selectedFactor * Number(value));
  };

  public render() {
    if (this.state.rateUnits.length > 0) {
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
}
