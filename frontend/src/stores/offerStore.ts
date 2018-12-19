import { computed, observable } from 'mobx';
import { Offer, OfferListing, Project } from '../types';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

export class OfferStore extends AbstractStore<Offer, OfferListing> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'die Offerte',
      plural: 'die Offerten',
    };
  }

  @computed
  public get entity(): Offer | undefined {
    return this.offer;
  }

  public set entity(offer: Offer | undefined) {
    this.offer = offer;
  }

  @computed
  public get entities(): Array<OfferListing> {
    return this.offers;
  }

  @observable
  public offers: OfferListing[] = [];
  @observable
  public offer?: Offer = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  public filter = (p: OfferListing) => {
    return [String(p.id), p.name, p.short_description || ''].some(s => s.toLowerCase().includes(this.searchQuery));
  };

  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/offers/' + id);
    await this.doFetchAll();
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Offer>('/offers/' + id + '/duplicate');
  }

  protected async doFetchAll(): Promise<void> {
    const res = await this.mainStore.api.get<OfferListing[]>('/offers');
    this.offers = res.data;
  }

  protected async doFetchOne(id: number) {
    this.offer = undefined;
    const res = await this.mainStore.api.get<Offer>('/offers/' + id);
    this.offer = res.data;
  }

  protected async doPost(entity: Offer): Promise<void> {
    const res = await this.mainStore.api.post<Offer>('/offers/', entity);
    this.offer = res.data;
  }

  protected async doPut(entity: Offer): Promise<void> {
    const res = await this.mainStore.api.put<Offer>('/offers/' + entity.id, entity);
    this.offer = res.data;
  }

  public async createProject(id: number): Promise<Project> {
    try {
      this.displayInProgress();
      const res = await this.mainStore.api.post<Project>(`/offers/${id}/create_project`);
      this.mainStore.displaySuccess('Das Projekt wurde erstellt');
      return res.data;
    } catch (e) {
      this.mainStore.displayError('Beim erstellen des Projekts ist ein Fehler aufgetreten');
      throw e;
    }
  }
}
