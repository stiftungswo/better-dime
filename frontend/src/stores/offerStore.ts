import * as _ from 'lodash';
import { action, computed, makeObservable, observable } from 'mobx';
import {
  Offer,
  OfferListing,
  PaginatedData,
  Project,
} from '../types';
import {Cache} from '../utilities/Cache';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class OfferStore extends AbstractPaginatedStore<Offer, OfferListing> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'Die Offerte',
      plural: 'Die Offerten',
    };
  }

  @computed
  get entity(): Offer | undefined {
    return this.offer;
  }

  set entity(offer: Offer | undefined) {
    this.offer = offer;
  }

  @computed
  get entities(): OfferListing[] {
    return this.offers;
  }

  @observable
  creatingProject: boolean = false;

  @observable
  offers: OfferListing[] = [];
  @observable
  offer?: Offer = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  setEntities(e: OfferListing[]) {
    this.offers = e;
  }

  async createProject(id: number, costgroup: number, category: number): Promise<Project> {
    try {
      this.displayInProgress();
      const res = await this.mainStore.apiV2.post<Project>(`/offers/${id}/create_project`, {costgroup, category});
      Cache.invalidateAllActiveCaches();
      this.mainStore.displaySuccess('Das Projekt wurde erstellt');
      return res.data;
    } catch (e) {
      this.mainStore.displayError('Beim erstellen des Projekts ist ein Fehler aufgetreten');
      throw e;
    }
  }

  protected async doDelete(id: number) {
    await this.mainStore.apiV2.delete('/offers/' + id);
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.apiV2.post<Offer>('/offers/' + id + '/duplicate');
  }

  protected async doFetchAll(): Promise<void> {
    this.mainStore.apiV2.get<OfferListing[]>('/offers').then(
      action(res => { this.offers = res.data; }),
    );
  }

  protected async doFetchFiltered(): Promise<void> {
    this.mainStore.apiV2.get<OfferListing[]>('/offers', {params: this.getQueryParams()}).then(
      action(res => { this.offers = res.data; }),
    );
  }

  protected async doFetchAllPaginated(): Promise<void> {
    this.mainStore.apiV2.get<PaginatedData<OfferListing>>('/offers', {params: this.getPaginatedQueryParams()}).then(action(res => {
      const page = res.data;
      this.offers = page.data;
      this.pageInfo = _.omit(page, 'data');
    }));
  }

  @action
  protected async doFetchOne(id: number) {
    this.offer = undefined;
    this.mainStore.apiV2.get<Offer>('/offers/' + id).then(
      action(res => { this.offer = res.data; }),
    );
  }

  protected async doPost(entity: Offer): Promise<void> {
    this.mainStore.apiV2.post<Offer>('/offers', entity).then(
      action(res => { this.offer = res.data; }),
    );
  }

  protected async doPut(entity: Offer): Promise<void> {
    this.mainStore.apiV2.put<Offer>('/offers/' + entity.id, entity).then(
      action(res => { this.offer = res.data; }),
    );
  }
}
