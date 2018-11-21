import React from 'react';
import { Grid, TextField } from '@material-ui/core';
import Select, { formikFieldCompatible } from '../Select';
import { RateUnit, RateUnitStore } from '../../../stores/rateUnitStore';
import { InputFieldProps } from '../common';
import compose from '../../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { LoadingSpinner } from '../../../layout/DimeLayout';

interface Props extends InputFieldProps {
  rateUnitId: number;
  rateUnitStore?: RateUnitStore;
}

interface State {
  rateUnit: undefined | RateUnit;
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
    rateUnit: undefined,
    rateUnits: [],
    selectedFactor: 1,
    value: this.props.form.values.value || 1,
  };

  public async componentDidMount() {
    await this.props.rateUnitStore!.fetchOne(this.props.rateUnitId);
    await this.props.rateUnitStore!.fetchAll();
    this.setState({
      rateUnits: this.props.rateUnitStore!.rateUnits!.filter((r: RateUnit) => r.is_time),
      selectedFactor: this.props.rateUnitStore!.rateUnit!.factor,
    });

    if (this.props.form.values.value) {
      this.setState({ value: this.props.form.values.value / this.state.selectedFactor });
    }
  }

  protected options() {
    return this.state.rateUnits!.map(e => ({
      value: e.factor,
      label: e.effort_unit,
    }));
  }

  protected updateSelectedFactor = (factor: number) => {
    this.setState({ selectedFactor: factor });
    this.props.form.setFieldValue(this.props.field.name, factor * this.state.value);
  };

  protected updateValue = (value: string) => {
    this.setState({ value: value });
    this.props.form.setFieldValue(this.props.field.name, this.state.selectedFactor * Number(value));
  };

  public render() {
    if (this.state.rateUnits.length > 0 && !this.state.rateUnit) {
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
              {...formikFieldCompatible({
                label: 'Zeiteinheit',
                value: this.state.selectedFactor,
                onChange: (value: number) => this.updateSelectedFactor(value),
              })}
            />
          </Grid>
        </Grid>
      );
    } else {
      return <LoadingSpinner />;
    }
  }
}
