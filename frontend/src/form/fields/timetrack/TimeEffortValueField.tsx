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
    selectedFactor: 1,
    value: this.props.value || 1,
  };

  public async componentDidMount() {
    this.setState({
      rateUnits: this.props.rateUnitStore!.rateUnits!.filter((r: RateUnit) => r.is_time),
    });

    const potentialRateUnit = this.props.rateUnitStore!.rateUnits!.find((r: RateUnit) => r.id === this.props.rateUnitId);
    if (potentialRateUnit) {
      this.setState({ selectedFactor: potentialRateUnit.factor });
    }

    if (this.props.value && potentialRateUnit) {
      this.setState({ value: this.props.value / potentialRateUnit.factor });
    }
  }

  protected options() {
    return this.state
      .rateUnits!.filter((e: RateUnit) => !e.archived || this.props.value === e.id)
      .map(e => ({
        value: e.factor,
        label: e.effort_unit,
      }));
  }

  protected updateSelectedFactor = (factor: number) => {
    this.setState({ selectedFactor: factor, value: (this.state.value * this.state.selectedFactor) / factor });
    this.props.onChange(factor * this.state.value);
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
              label={'Wert'}
              value={this.state.value}
              onChange={e => this.updateValue(e.target.value)}
              fullWidth
              style={{ marginTop: '16px', marginBottom: '8px' }}
              inputProps={{ step: '0.01' }}
            />
          </Grid>
          <Grid item xs={3}>
            <Select
              options={this.options()}
              portal
              label={'Zeiteinheit'}
              value={this.state.selectedFactor}
              onChange={(value: number) => this.updateSelectedFactor(value)}
            />
          </Grid>
        </Grid>
      );
    } else {
      return <LoadingSpinner />;
    }
  }
}
