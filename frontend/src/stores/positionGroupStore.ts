import { action, computed, observable } from 'mobx';
import {Company, PositionGroup} from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class PositionGroupStore extends AbstractStore<PositionGroup> {

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Die Servicegruppe',
      plural: 'Die Servicegruppen',
    };
  }

  @computed
  get entity(): PositionGroup | undefined {
    return this.positionGroup;
  }

  set entity(positionGroup: PositionGroup | undefined) {
    this.positionGroup = positionGroup;
  }

  @computed
  get entities(): PositionGroup[] {
    return this.positionGroups;
  }

  @observable
  positionGroups: PositionGroup[] = [];
  @observable
  positionGroup?: PositionGroup = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  @action
  async doFetchAll() {
    const res = await this.mainStore.api.get<PositionGroup[]>('/position_groups', {params: this.getQueryParams()});
    this.positionGroups = res.data;
  }

  @action
  async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<Company>('/position_groups/' + id);
    this.positionGroup = res.data;
  }

  @action
  async doPost(positionGroup: PositionGroup) {
    const res = await this.mainStore.api.post('/position_groups', positionGroup);
    this.positionGroup = res.data;
  }

  @action
  async doPut(positionGroup: PositionGroup) {
    const res = await this.mainStore.api.put('/position_groups/' + positionGroup.id, positionGroup);
    this.positionGroup = res.data;
  }
}
