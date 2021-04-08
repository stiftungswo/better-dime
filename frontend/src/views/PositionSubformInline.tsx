import {Grid} from '@material-ui/core';
import {Warning} from '@material-ui/icons';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import PositionMoveDialog from '../form/PositionMoveDialog';
import { ServiceSelectDialog } from '../form/ServiceSelectDialog';
import { MainStore } from '../stores/mainStore';
import {PositionGroupStore} from '../stores/positionGroupStore';
import {RateUnitStore} from '../stores/rateUnitStore';
import { ServiceStore } from '../stores/serviceStore';
import {PositionGroup, RateUnit, Service, ServiceListing, ServiceRate} from '../types';
import compose from '../utilities/compose';
import { getInsertionIndex } from '../utilities/getInsertionIndex';
import {defaultPositionGroup} from '../utilities/helpers';

export interface Props {
  mainStore?: MainStore;
  serviceStore?: ServiceStore;
  rateUnitStore?: RateUnitStore;
  positionGroupStore?: PositionGroupStore;
  formikProps: FormikProps<any>;
  name: string;
  tag: any;
  disabled?: boolean;
}

@compose(
  inject('mainStore', 'serviceStore', 'positionGroupStore', 'rateUnitStore'),
  observer,
)
export default class PositionSubformInline extends React.Component<Props> {
  state = {
    dialogOpen: false,
    selected_group: defaultPositionGroup().name,
    moving: false,
    moving_index: null,
  };

  updateArchivedRateUnitStatus = () => {
    let archivedRates = false;
    let archivedServices = false;

    for (const position of this.props.formikProps.values.positions) {
      const rateUnit = this.props.rateUnitStore!.rateUnits.find((r: RateUnit) => {
        return r.id === position.rate_unit_id;
      });
      const service = position.service_id != null ? this.props.serviceStore!.services.find((s: ServiceListing) => {
        return s.id === position.service_id;
      }) : null;
      archivedRates = archivedRates || (rateUnit != null && rateUnit.archived);
      archivedServices = archivedServices || (service != null && service.archived);
    }

    const archivedUnits = archivedServices || archivedRates;

    if ((this.props.formikProps.status == null || this.props.formikProps.status.archived_units == null && archivedUnits)) {
      this.props.formikProps.setStatus({archived_units: archivedUnits});
    } else if (this.props.formikProps.status.archived_units !== archivedUnits) {
      this.props.formikProps.setStatus({archived_units: archivedUnits});
    }
  }

  componentDidMount(): void {
    this.updateArchivedRateUnitStatus();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any) {
    this.updateArchivedRateUnitStatus();
  }

  insertService = (arrayHelpers: ArrayHelpers, service: Service, rate: ServiceRate, groupId: number | null) => {
    const insertIndex = getInsertionIndex(this.props.formikProps.values.positions.map((p: any) => p.order), service.order, (a, b) => a - b);
    arrayHelpers.insert(insertIndex, {
      amount: '',
      description: '',
      order: service.order,
      vat: service.vat,
      service_id: service.id,
      position_group_id: groupId,
      rate_unit_id: rate.rate_unit_id,
      price_per_rate: rate.value,
      formikKey: Math.random(),
    });
    this.updateArchivedRateUnitStatus();
  }

  handleUpdate = (arrayHelpers: ArrayHelpers) => (positionIndex: number, newGroupId: number | null) => {
    const item = arrayHelpers.remove(positionIndex) as any;
    item.position_group_id = newGroupId;
    const insertIndex = getInsertionIndex(this.props.formikProps.values.positions.map((p: any) => p.order), item.order, (a, b) => a - b);
    arrayHelpers.insert(insertIndex, item);
    this.updateArchivedRateUnitStatus();
  }

  handleAdd = (arrayHelpers: ArrayHelpers) => (service: Service, groupName: string | null) => {
    const rate = service.service_rates.find(r => r.rate_group_id === this.props.formikProps.values.rate_group_id);
    if (!rate) {
      throw new Error('no rate was found');
    }
    const positionGroupName = groupName != null ? groupName : '';

    const group = [defaultPositionGroup(), ...this.props.formikProps.values.position_groupings].find((e: PositionGroup) => {
      return e.name.toLowerCase() === positionGroupName.toLowerCase();
    });

    if (group == null && positionGroupName != null && positionGroupName.length > 0) {
      this.props.positionGroupStore!.post({name: positionGroupName}).then(nothing => {
        this.props.formikProps.values.position_groupings.push({
          id: this.props.positionGroupStore!.positionGroup!.id,
          name: positionGroupName,
        });
        this.insertService(arrayHelpers, service, rate, this.props.positionGroupStore!.positionGroup!.id!);
      });
    } else if (group != null && group.id != null) {
      this.insertService(arrayHelpers, service, rate, group.id);
    } else {
      this.insertService(arrayHelpers, service, rate, null);
    }
    this.updateArchivedRateUnitStatus();
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
                  placeholder={defaultPositionGroup().name}
                  groupName={this.state.selected_group === defaultPositionGroup().name ? '' : this.state.selected_group}
                  groupingEntity={this.props.formikProps.values}
                />
              )}
              {this.state.moving && (
                <PositionMoveDialog
                  positionIndex={this.state.moving_index!}
                  groupingEntity={this.props.formikProps.values}
                  placeholder={defaultPositionGroup().name}
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
