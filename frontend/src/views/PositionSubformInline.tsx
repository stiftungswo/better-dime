import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import PositionMoveDialog from '../form/PositionMoveDialog';
import { ServiceSelectDialog } from '../form/ServiceSelectDialog';
import { MainStore } from '../stores/mainStore';
import {PositionGroupStore} from '../stores/positionGroupStore';
import { ServiceStore } from '../stores/serviceStore';
import {PositionGroup, Service, ServiceRate} from '../types';
import compose from '../utilities/compose';
import { getInsertionIndex } from '../utilities/getInsertionIndex';
import {defaultPositionGroup} from '../utilities/helpers';
import ProjectPositionRenderer from './projects/ProjectPositionRenderer';

export interface Props {
  mainStore?: MainStore;
  serviceStore?: ServiceStore;
  positionGroupStore?: PositionGroupStore;
  formikProps: FormikProps<any>;
  name: string;
  tag: any;
  disabled?: boolean;
}

@compose(
  inject('mainStore', 'serviceStore', 'positionGroupStore'),
  observer,
)
export default class PositionSubformInline extends React.Component<Props> {
  state = {
    dialogOpen: false,
    selected_group: undefined,
    moving: false,
    moving_index: null,
  };

  insertService = (arrayHelpers: ArrayHelpers, service: Service, rate: ServiceRate, groupId: number | null) => {
    const insertIndex = getInsertionIndex(this.props.formikProps.values.positions.map((p: any) => p.order), service.order, (a, b) => a - b);
    arrayHelpers.insert(insertIndex, {
      description: '',
      order: service.order,
      vat: service.vat,
      service_id: service.id,
      position_group_id: groupId,
      rate_unit_id: rate.rate_unit_id,
      price_per_rate: rate.value,
      formikKey: Math.random(),
    });
  }

  handleUpdate = (arrayHelpers: ArrayHelpers) => (positionIndex: number, newGroupId: number | null) => {
    const item = arrayHelpers.remove(positionIndex) as any;
    item.position_group_id = newGroupId;
    const insertIndex = getInsertionIndex(this.props.formikProps.values.positions.map((p: any) => p.order), item.order, (a, b) => a - b);
    arrayHelpers.insert(insertIndex, item);
  }

  handleAdd = (arrayHelpers: ArrayHelpers) => (service: Service, groupName: string) => {
    const rate = service.service_rates.find(r => r.rate_group_id === this.props.formikProps.values.rate_group_id);
    if (!rate) {
      throw new Error('no rate was found');
    }

    const group = [defaultPositionGroup(), ...this.props.formikProps.values.position_groupings].find((e: PositionGroup) => {
      return e.name.toLowerCase() === groupName.toLowerCase();
    });

    if (group == null && groupName != null && groupName.length > 0) {
      this.props.positionGroupStore!.post({name: groupName}).then(nothing => {
        this.props.formikProps.values.position_groupings.push({
          id: this.props.positionGroupStore!.positionGroup!.id,
          name: groupName,
        });
        this.insertService(arrayHelpers, service, rate, this.props.positionGroupStore!.positionGroup!.id!);
      });
    } else if (group != null && group.id != null) {
      this.insertService(arrayHelpers, service, rate, group.id);
    } else {
      this.insertService(arrayHelpers, service, rate, null);
    }
  }

  renderTable = (arrayHelpers: any, values: any, group: PositionGroup, isFirst: boolean) => {
    const Tag = this.props.tag;
    return (
      <>
        <Tag
          arrayHelpers={arrayHelpers}
          onDelete={(idx: number) => arrayHelpers.remove(idx)}
          onMove={(idx: number) => this.setState({moving: true, moving_index: idx})}
          onAdd={!this.props.formikProps.values.rate_group_id ? undefined : () => {
            this.setState({ selected_group: group.name, dialogOpen: true });
          }}
          group={group}
          values={values}
          name={this.props.name}
          isFirst={isFirst}
          disabled={this.props.disabled}
        />
      </>
    );
  }

  render() {
    const { values } = this.props.formikProps;
    const groups = [defaultPositionGroup(), ...values.position_groupings];

    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => {
          return (
            <>
              {groups.filter(e => e != null && (e.name === defaultPositionGroup().name || values.positions.filter((p: any) => {
                return p.position_group_id === e.id;
              }).length > 0)).sort((a: PositionGroup, b: PositionGroup) => {
                return a.name.localeCompare(b.name);
              }).map((e: any, index: number) => {
                return this.renderTable(arrayHelpers, values, e, index === 0);
              })}
              {this.state.dialogOpen && (
                <ServiceSelectDialog
                  open
                  onClose={() => this.setState({ dialogOpen: false })}
                  onSubmit={this.handleAdd(arrayHelpers)}
                  groupName={this.state.selected_group}
                  groupingEntity={this.props.formikProps.values}
                />
              )}
              {this.state.moving && (
                <PositionMoveDialog
                  positionIndex={this.state.moving_index!}
                  groupingEntity={this.props.formikProps.values}
                  onUpdate={this.handleUpdate(arrayHelpers)}
                  onClose={() => {
                    this.setState({moving: false, moving_index: null});
                  }}
                />
              )}
            </>
          );
        }
        }
      />
    );
  }
}
