import * as _ from 'lodash';
import { computed, observable } from 'mobx';
import {Offer, OfferListing, PaginatedOfferListing, PaginatedProjectListing, Project, ProjectListing} from '../types';
import {Cache} from '../utilities/Cache';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class OfferStore extends AbstractPaginatedStore<Offer, OfferListing> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'die Offerte',
      plural: 'die Offerten',
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
  offers: OfferListing[] = [];
  @observable
  offer?: Offer = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  setEntities(e: OfferListing[]) {
    this.offers = e;
  }

  async createProject(id: number): Promise<Project> {
    try {
      this.displayInProgress();
      const res = await this.mainStore.api.post<Project>(`/offers/${id}/create_project`);
      Cache.invalidateAllActiveCaches();
      this.mainStore.displaySuccess('Das Projekt wurde erstellt');
      return res.data;
    } catch (e) {
      this.mainStore.displayError('Beim erstellen des Projekts ist ein Fehler aufgetreten');
      throw e;
    }
  }

  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/offers/' + id);
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Offer>('/offers/' + id + '/duplicate');
  }

  protected async doFetchAll(): Promise<void> {
    const res = await this.mainStore.api.get<OfferListing[]>('/offers');
    this.offers = res.data;
  }

  protected async doFetchFiltered(): Promise<void> {
    const res = await this.mainStore.api.get<OfferListing[]>('/offers', {params: this.getQueryParams()});
    this.offers = res.data;
  }

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.api.get<PaginatedOfferListing>('/offers', {params: this.getPaginatedQueryParams()});
    const page = res.data;
    this.offers = page.data;
    this.pageInfo = _.omit(page, 'data');
  }

  protected async doFetchOne(id: number) {
    this.offer = undefined;
    const res = await this.mainStore.api.get<Offer>('/offers/' + id);
    this.offer = res.data;
  }

  protected async doPost(entity: Offer): Promise<void> {
    const res = await this.mainStore.api.post<Offer>('/offers', entity);
    this.offer = res.data;
  }

  protected async doPut(entity: Offer): Promise<void> {
    const res = await this.mainStore.api.put<Offer>('/offers/' + entity.id, entity);
    this.offer = res.data;
  }
}
