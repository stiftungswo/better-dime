import { Warning } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { ArrayHelpers, FieldArray, FormikProps } from 'formik';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { PositionGroupRenameDialog } from '../form/dialog/PositionGroupRenameDialog';
import { PositionGroupSortDialog } from '../form/dialog/PositionGroupSortDialog';
import PositionGroupsReorderDialog from '../form/dialog/PositionGroupsReorderDialog';
import PositionMoveDialog from '../form/dialog/PositionMoveDialog';
import { ServiceSelectDialog } from '../form/dialog/ServiceSelectDialog';
import { ActionButton } from '../layout/ActionButton';
import { MoveIcon, ReorderIcon, SortIcon } from '../layout/icons';
import { MainStore } from '../stores/mainStore';
import { PositionGroupStore } from '../stores/positionGroupStore';
import { RateUnitStore } from '../stores/rateUnitStore';
import { ServiceStore } from '../stores/serviceStore';
import { PositionGroup, RateUnit, Service, ServiceListing, ServiceRate } from '../types';
import compose from '../utilities/compose';
import { getInsertionIndex } from '../utilities/getInsertionIndex';
import { defaultPositionGroup } from '../utilities/helpers';
import { wrapIntl } from '../utilities/wrapIntl';

export interface Props {
  mainStore?: MainStore;
  serviceStore?: ServiceStore;
  rateUnitStore?: RateUnitStore;
  positionGroupStore?: PositionGroupStore;
  intl?: IntlShape;
  formikProps: FormikProps<any>;
  name: string;
  tag: any;
  disabled?: boolean;
}

@compose(
  injectIntl,
  inject('mainStore', 'serviceStore', 'positionGroupStore', 'rateUnitStore'),
  observer,
)
export default class PositionSubformInline extends React.Component<Props> {
  state = {
    dialogAddOpen: false,
    dialogSortOpen: false,
    dialogRenameOpen: false,
    dialogReorderOpen: false,
    selected_group: defaultPositionGroup().name,
    moving: false,
    moving_index: null,
  };

  getPositionsInGroup = (groupId: number | null) => {
    return this.props.formikProps.values.positions.filter((p: any) => p.position_group_id === groupId);
  }
  getGroupsInOrder() {
    return [defaultPositionGroup(), ...this.props.formikProps.values.position_groupings]
      .sort((a: PositionGroup, b: PositionGroup) => {
        return (a.order || 0) - (b.order || 0)
         || a.name.localeCompare(b.name);
      });
  }

  overwritePositionsInGroup = (groupId: number | null, newPositions: any) => {
    const otherPositions = this.props.formikProps.values.positions.filter((p: any) => p.position_group_id !== groupId);
    this.props.formikProps.values.positions = [].concat(otherPositions).concat(newPositions);
    this.recomputeRelativeOrder();
  }

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

  recomputeRelativeOrder() {
    // recompute relative order among all positions.
    this.props.formikProps.values.positions.forEach((p: any, index: number) => {
      p.order = index;
    });
    this.updateArchivedRateUnitStatus();
  }

  insertServiceItem(arrayHelpers: ArrayHelpers, serviceItem: any, serviceOrder: number) {
    // only consider positions from the same group
    const relevantPositions = this.getPositionsInGroup(serviceItem.position_group_id);
    const relevantServiceOrders = relevantPositions.map((p: any) => p.service?.order || 0);
    const relevantIndex = getInsertionIndex(relevantServiceOrders, serviceOrder, (a, b) => a - b);
    // now we have an index in relevantPositions, but we want an index in all positions.
    const fullIndex = relevantIndex === 0 ? 0 : relevantPositions[relevantIndex - 1].order + 1;
    arrayHelpers.insert(fullIndex, serviceItem);
    this.recomputeRelativeOrder();
  }

  insertService = (arrayHelpers: ArrayHelpers, service: Service, rate: ServiceRate, groupId: number | null) => {
    // we're building a partial ProjectPosition object here.
    // this will be replaced by a full ProjectPosition object once the user saves.
    this.insertServiceItem(arrayHelpers, {
      amount: '',
      description: '',
      // relative order in the array, not be be confused with the order value of a service.
      // this will be set by insertServiceItem.
      order: 0,
      vat: service.vat,
      service_id: service.id,
      service,
      position_group_id: groupId,
      rate_unit_id: rate.rate_unit_id,
      price_per_rate: rate.value,
      formikKey: Math.random(),
    }, service.order);
  }

  findGroupFromName = (groupName: string | null) => {
    if (groupName == null || groupName === '') {
      return defaultPositionGroup();
    }
    return [defaultPositionGroup(), ...this.props.formikProps.values.position_groupings].find((e: PositionGroup) => {
      return e.name.toLowerCase() === groupName.toLowerCase();
    });
  }

  sortServices = (arrayHelpers: ArrayHelpers, groupId: number | null) => {
    const sortedPositions = this.getPositionsInGroup(groupId)
      .sort((p: any, q: any) => p.service.order - q.service.order);
    this.overwritePositionsInGroup(groupId, sortedPositions);
  }

  // move all serves from one group to another. This can be used for renaming among other things.
  renameGroup = (oldGroup: number | null, newGroup: number | null) => {
    const renamedPositions = this.getPositionsInGroup(oldGroup)
      .map((p: any) => ({...p, position_group_id: newGroup}));
    // slight abuse of notation here: we want to delete all services of oldGroup
    // while adding some additional services to newGroup. This call does just that.
    this.overwritePositionsInGroup(oldGroup, renamedPositions);
  }

  handleUpdate = (arrayHelpers: ArrayHelpers) => (positionIndex: number, newGroupId: number | null) => {
    const item = arrayHelpers.remove(positionIndex) as any;
    item.position_group_id = newGroupId;
    // if we're dealing with invoices, item.service is undefined
    this.insertServiceItem(arrayHelpers, item, item.service?.order || 1);
  }

  handleAdd = (arrayHelpers: ArrayHelpers) => (service: Service, groupName: string | null) => {
    const rate = service.service_rates.find(r => r.rate_group_id === this.props.formikProps.values.rate_group_id);
    if (!rate) {
      throw new Error('no rate was found');
    }
    const positionGroupName = groupName != null ? groupName : '';

    const group = this.findGroupFromName(groupName);

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
  handleSort = (arrayHelpers: ArrayHelpers) =>  (groupName: string | null) => {
    const group = this.findGroupFromName(groupName);
    if (group != null) {
      this.sortServices(arrayHelpers, group.id);
    }
  }
  handleRename = (groups: PositionGroup[]) => (groupName: string, newGroup: number | null) => {
    const oldGroup = this.findGroupFromName(groupName);
    if (oldGroup != null) {
      this.renameGroup(oldGroup.id, newGroup);
    }
  }
  handleReorder = (groups: PositionGroup[]) => (reorderedGroups: PositionGroup[]) => {
    // the defaulPositionGroup() is not stored in the DB,
    // so it will have to end up with an order of 0.
    const offset = reorderedGroups.find(e => e.id === defaultPositionGroup().id)?.order || 0;
    groups.forEach((g: PositionGroup) => {
      // .find should never return undefined here, but just in case
      const newOrder = reorderedGroups.find(e => e.id === g.id)?.order || 0;
      g.order = newOrder - offset;
    });
  }

  renderTable = (arrayHelpers: any, values: any, group: PositionGroup, isFirst: boolean) => {
    const Tag = this.props.tag;
    const { disabled, formikProps } = this.props;
    const makeButtonAction = (stateUpdate: any) => () => { this.setState({ selected_group: group.name, ...stateUpdate }); };
    const hasSharedGroups = formikProps.values.position_groupings.some((e: any) => e.shared);
    const intlText = wrapIntl(this.props.intl!, 'view.position_subform_inline');
    return (
      <>
        <Tag
          arrayHelpers={arrayHelpers}
          onDelete={(idx: number) => arrayHelpers.remove(idx)}
          onMove={(idx: number) => this.setState({moving: true, moving_index: idx})}
          onAdd={!formikProps.values.rate_group_id ? undefined : () => {
            this.setState({ selected_group: group.name, dialogAddOpen: true });
          }}
          group={group}
          values={values}
          name={this.props.name}
          isFirst={isFirst}
          disabled={disabled}
          groupRenameButton={(<ActionButton disabled={disabled} icon={MoveIcon} action={makeButtonAction({dialogRenameOpen: true })} title={intlText('move_group')} />)}
          groupSortButton={(<ActionButton disabled={disabled} icon={SortIcon} action={makeButtonAction({dialogSortOpen: true })} title={intlText('sort_group')} />)}
          groupReorderButton={(<ActionButton
            disabled={disabled || hasSharedGroups}
            icon={ReorderIcon}
            action={makeButtonAction({dialogReorderOpen: true })}
            title={hasSharedGroups ? intlText('save_first') : intlText('groups_order')}
          />)}
        />
      </>
    );
  }

  render() {
    const { values } = this.props.formikProps;
    const groups = this.getGroupsInOrder();

    return (
      <FieldArray
        name={this.props.name}
        render={arrayHelpers => {
          return (
            <>
              {groups.filter(e => e != null && (e.name === defaultPositionGroup().name || values.positions.filter((p: any) => {
                return p != null && p.position_group_id === e.id;
              }).length > 0)).map((e: any, index: number) => {
                return this.renderTable(arrayHelpers, values, e, index === 0);
              })}
              {this.state.dialogAddOpen && (
                <ServiceSelectDialog
                  open
                  onClose={() => this.setState({ dialogAddOpen: false })}
                  onSubmit={this.handleAdd(arrayHelpers)}
                  placeholder={defaultPositionGroup().name}
                  groupName={this.state.selected_group === defaultPositionGroup().name ? '' : this.state.selected_group}
                  groupingEntity={this.props.formikProps.values}
                />
              )}
              {this.state.dialogSortOpen && (
                <PositionGroupSortDialog
                  open
                  onClose={() => this.setState({ dialogSortOpen: false })}
                  onSubmit={this.handleSort(arrayHelpers)}
                  placeholder={defaultPositionGroup().name}
                  groupName={this.state.selected_group === defaultPositionGroup().name ? '' : this.state.selected_group}
                  groupingEntity={this.props.formikProps.values}
                />
              )}
              {this.state.dialogRenameOpen && (
                <PositionGroupRenameDialog
                  open
                  onClose={() => this.setState({ dialogRenameOpen: false })}
                  onSubmit={this.handleRename(this.props.formikProps.values.position_groupings)}
                  placeholder={defaultPositionGroup().name}
                  groupName={this.state.selected_group === defaultPositionGroup().name ? '' : this.state.selected_group}
                  groupingEntity={this.props.formikProps.values}
                />
              )}
              {this.state.dialogReorderOpen && (
                <PositionGroupsReorderDialog
                  open
                  onClose={() => this.setState({ dialogReorderOpen: false })}
                  onSubmit={this.handleReorder(this.props.formikProps.values.position_groupings)}
                  allGroups={groups}
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
