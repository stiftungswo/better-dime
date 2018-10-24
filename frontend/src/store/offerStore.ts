import { observable } from 'mobx';
import { Offer } from '../types';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

export interface OfferListing {
  id: number;
  name: string;
  shortDescription: string;
}

export class OfferStore extends AbstractStore<Offer> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'die Offerte',
      plural: 'die Offerten',
    };
  }

  @observable public offers: OfferListing[] = [];
  @observable public offer?: Offer = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  protected async doFetchAll(): Promise<void> {
    const res = await this.mainStore.api.get<OfferListing[]>('/offers');
    this.offers = res.data;
  }

  protected async doFetchOne(id: number) {
    const res = await this.mainStore.api.get<Offer>('/offers/' + id);
    this.offer = res.data;
  }
}
