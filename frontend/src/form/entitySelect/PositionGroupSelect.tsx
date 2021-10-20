import { inject, observer } from 'mobx-react';
import React from 'react';
import {AbstractStore} from '../../stores/abstractStore';
import {PositionGroup, PositionGroupings} from '../../types';
import compose from '../../utilities/compose';
import {defaultPositionGroup} from '../../utilities/helpers';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<string | null> {
  groupingEntity: PositionGroupings<any>;
  placeholder?: string;
  creatable: boolean;
}

@compose(
  observer,
)
export class PositionGroupSelect extends React.Component<Props> {
  static defaultProps = {
      creatable: true,
  };
  state = {
    createdOptions: [] as any,
  };

  addOption = (option: any) => {
    if (this.state.createdOptions.findIndex((e: any) => e.value === option.value) < 0) {
      this.state.createdOptions.push({
        value: `${option.label}`,
        label: `${option.label}`,
      });
    }
  }

  onCreate = (created: any) => {
    if (Array.isArray(created)) {
      created.forEach((e: any) => {
        this.addOption(e);
      });
    } else {
      this.addOption(created);
    }
  }

  get options() {
    if (this.props.groupingEntity) {
      const loadedOptions = [defaultPositionGroup(), ...this.props.groupingEntity!.position_groupings].map((e: PositionGroup) => ({
          value: `${e.name}`,
          label: `${e.name}`,
      }));

      const filteredCreated = this.state.createdOptions.filter((e: any) => {
        return loadedOptions.findIndex((l: any) => l.value === e.value) < 0;
      });
      return loadedOptions.concat(filteredCreated);
    } else {
      return [];
    }
  }

  render() {
    if (this.props.groupingEntity) {
      return (
        <Select
          isClearable
          formatCreateLabel={(userInput: any) => `Erstellen: ${userInput}`}
          onCreate={this.onCreate}
          options={this.options}
          {...this.props}
        />
      );
    } else {
      return <Select options={[]} isDisabled placeholder={'Kein Subjekt wurde übergeben'} {...this.props} />;
    }
  }
}
