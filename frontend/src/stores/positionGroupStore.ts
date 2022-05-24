import { action, computed, makeObservable, observable, override } from 'mobx';
import {Company, PositionGroup} from '../types';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

// this has a weird subset of functionality, hence didn't rewrite it with AbstractSimpleStore
export class PositionGroupStore extends AbstractStore<PositionGroup> {

  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Die Servicegruppe',
      plural: 'Die Servicegruppen',
    };
  }

  get entity(): PositionGroup | undefined {
    return this.positionGroup;
  }

  set entity(positionGroup: PositionGroup | undefined) {
    this.positionGroup = positionGroup;
  }

  get entities(): PositionGroup[] {
    return this.positionGroups;
  }

  positionGroups: PositionGroup[] = [];
  positionGroup?: PositionGroup = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this, {
      entity: computed,
      entities: computed,
      positionGroups: observable,
      positionGroup: observable,
      doFetchAll: action,
      doFetchOne: action,
      doPost: override,
      doPut: override,
    });
  }

  async doFetchAll() {
    throw new Error('Not implemented, position group are never accessed directly');
  }

  async doFetchOne(id: number) {
    throw new Error('Not implemented, position group are never accessed directly');
  }

  async doPost(positionGroup: PositionGroup) {
    const res = await this.mainStore.apiV2.post('/position_groups', positionGroup);
    this.positionGroup = res.data;
  }

  async doPut(positionGroup: PositionGroup) {
    throw new Error('Not implemented, position group are never edited');
  }
}
