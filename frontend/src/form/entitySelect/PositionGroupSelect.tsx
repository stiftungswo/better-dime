import { inject, observer } from 'mobx-react';
import React from 'react';
import {AbstractStore} from '../../stores/abstractStore';
import {PositionGroup} from '../../types';
import compose from '../../utilities/compose';
import {defaultPositionGroup} from '../../utilities/helpers';
import { DimeCustomFieldProps } from '../fields/common';
import Select from '../fields/Select';

interface Props extends DimeCustomFieldProps<string | null> {
  entityId: number;
  store?: AbstractStore<any, any>;
}

@compose(
  observer,
)
export class PositionGroupSelect extends React.Component<Props> {
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
    if (this.props.store!.entity) {
      const loadedOptions = [defaultPositionGroup(), ...this.props.store!.entity!.position_groupings].map((e: PositionGroup) => ({
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
  componentDidMount() {
    if (this.props.store!.entity == null || this.props.store!.entity.id !== this.props.entityId) {
      this.updateEntityInStore();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.entityId !== prevProps.entityId) {
      this.props.onChange(null);
      this.updateEntityInStore();
    }
  }

  render() {
    if (this.props.entityId) {
      if (this.props.store!.entity) {
        return <Select creatable onCreate={this.onCreate} options={this.options} {...this.props} />;
      } else {
        return <Select options={[]} isDisabled isLoading placeholder={'Positionengruppen werden abgerufen ...'} {...this.props} />;
      }
    } else {
      return <Select options={[]} isDisabled placeholder={'Zuerst Subjekt auswählen'} {...this.props} />;
    }
  }

  protected async updateEntityInStore() {
    if (this.props.entityId) {
      await this.props.store!.fetchOne(this.props.entityId);
    }
  }
}
