import { action, computed, makeObservable, observable, override } from 'mobx';
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
    makeObservable(this);
  }

  async doFetchAll() {
    throw new Error('Not implemented, position group are never accessed directly');
  }

  async doFetchOne(id: number) {
    throw new Error('Not implemented, position group are never accessed directly');
  }

  async doPost(positionGroup: PositionGroup) {
    this.mainStore.apiV2.post('/position_groups', positionGroup).then(
      action(res => { this.positionGroup = res.data; }),
    );
  }

  async doPut(positionGroup: PositionGroup) {
    throw new Error('Not implemented, position group are never edited');
  }
}
