import React from 'react';
import { DimeCustomFieldProps, NumberField } from '../common';
import { RateUnitStore } from '../../../stores/rateUnitStore';
import compose from '../../../utilities/compose';
import { inject, observer } from 'mobx-react';

interface Props extends DimeCustomFieldProps<number> {
  rateUnitId: number;
  rateUnitStore?: RateUnitStore;
}

@compose(
  inject('rateUnitStore'),
  observer
)
export class FlatEffortValueField extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public state = {
    name: '',
  };

  public async componentDidMount() {
    this.updateRateUnitLabel();
  }

  public async componentDidUpdate(prevProps: Props) {
    if (this.props.rateUnitId !== prevProps.rateUnitId) {
      this.updateRateUnitLabel();
    }
  }

  protected async updateRateUnitLabel() {
    await this.props.rateUnitStore!.fetchOne(this.props.rateUnitId);
    this.setState({ name: this.props.rateUnitStore!.rateUnit!.name });
  }

  public render() {
    return (
      <NumberField
        type={this.props.type}
        label={this.props.label}
        value={String(this.props.value)}
        onChange={e => this.props.onChange(e.target.value as any)}
        unit={this.state.name}
      />
    );
  }
}
