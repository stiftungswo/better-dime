import * as _ from 'lodash';
import { computed, observable } from 'mobx';
import {Invoice, InvoiceListing, PaginatedInvoiceListing, PaginatedProjectListing, ProjectListing} from '../types';
import {AbstractPaginatedStore} from './abstractPaginatedStore';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

export class InvoiceStore extends AbstractPaginatedStore<Invoice, InvoiceListing> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'die Rechnung',
      plural: 'die Rechnungen',
    };
  }

  @computed
  get entity(): Invoice | undefined {
    return this.invoice;
  }

  set entity(invoice: Invoice | undefined) {
    this.invoice = invoice;
  }

  get entities(): InvoiceListing[] {
    return this.invoices;
  }

  @observable
  invoices: InvoiceListing[] = [];
  @observable
  invoice?: Invoice = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  setEntities(e: InvoiceListing[]) {
    this.invoices = e;
  }

  protected async doDelete(id: number) {
    await this.mainStore.apiV2.delete('/invoices/' + id);
  }

  protected async doFetchAll(): Promise<void> {
    const res = await this.mainStore.apiV2.get<InvoiceListing[]>('/invoices');
    this.invoices = res.data;
  }

  protected async doFetchFiltered(): Promise<void> {
    const res = await this.mainStore.apiV2.get<InvoiceListing[]>('/invoices', {params: this.getQueryParams()});
    this.invoices = res.data;
  }

  protected async doFetchAllPaginated(): Promise<void> {
    const res = await this.mainStore.apiV2.get<PaginatedInvoiceListing>('/invoices', {params: this.getPaginatedQueryParams()});
    const page = res.data;
    this.invoices = page.data;
    this.pageInfo = _.omit(page, 'data');
  }

  protected async doFetchOne(id: number) {
    this.invoice = undefined;
    const res = await this.mainStore.apiV2.get<Invoice>('/invoices/' + id);
    this.invoice = res.data;
  }

  protected async doPost(entity: Invoice): Promise<void> {
    const res = await this.mainStore.apiV2.post<Invoice>('/invoices', entity);
    this.invoice = res.data;
  }

  protected async doPut(entity: Invoice): Promise<void> {
    const res = await this.mainStore.apiV2.put<Invoice>('/invoices/' + entity.id, entity);
    this.invoice = res.data;
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.apiV2.post<Invoice>('/invoices/' + id + '/duplicate');
  }
}
