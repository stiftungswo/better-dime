import { inject, observer } from 'mobx-react';
import React from 'react';
import { RateUnitStore } from '../../../stores/rateUnitStore';
import compose from '../../../utilities/compose';
import { DimeCustomFieldProps, NumberField } from '../common';

interface Props extends DimeCustomFieldProps<number> {
  rateUnitId: number;
  rateUnitStore?: RateUnitStore;
}

@compose(
  inject('rateUnitStore'),
  observer,
)
export class FlatEffortValueField extends React.Component<Props> {

  state = {
    name: '',
  };
  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    this.updateRateUnitLabel();
  }

  async componentDidUpdate(prevProps: Props) {
    if (this.props.rateUnitId !== prevProps.rateUnitId) {
      this.updateRateUnitLabel();
    }
  }

  render() {
    return (
      <NumberField
        type={'number'}
        label={this.props.label}
        value={this.props.value}
        onChange={e => {
          this.props.onChange(e!);
        }}
        unit={this.state.name}
      />
    );
  }

  protected async updateRateUnitLabel() {
    await this.props.rateUnitStore!.fetchOne(this.props.rateUnitId);
    this.setState({ name: this.props.rateUnitStore!.rateUnit!.name });
  }
}
