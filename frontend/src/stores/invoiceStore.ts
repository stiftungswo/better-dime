import { computed, observable } from 'mobx';
import { Invoice } from '../types';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';

export interface InvoiceListing {
  id: number;
  accountant_id: number;
  address_id: number;
  description: string;
  end: string;
  fixed_price: null;
  project_id: number;
  name: string;
  start: string;
}

export class InvoiceStore extends AbstractStore<Invoice, InvoiceListing> {
  protected get entityName(): { singular: string; plural: string } {
    return {
      singular: 'die Rechnung',
      plural: 'die Rechnungen',
    };
  }

  @computed
  public get entity(): Invoice | undefined {
    return this.invoice;
  }

  public set entity(invoice: Invoice | undefined) {
    this.invoice = invoice;
  }

  get entities(): Array<InvoiceListing> {
    return this.invoices;
  }

  @observable
  public invoices: InvoiceListing[] = [];
  @observable
  public invoice?: Invoice = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  public filter = (p: InvoiceListing) => {
    return [String(p.id), p.name, p.description || ''].some(s => s.toLowerCase().includes(this.searchQuery));
  };

  protected async doDelete(id: number) {
    await this.mainStore.api.delete('/invoices/' + id);
    await this.doFetchAll();
  }

  protected async doFetchAll(): Promise<void> {
    const res = await this.mainStore.api.get<InvoiceListing[]>('/invoices');
    this.invoices = res.data;
  }

  protected async doFetchOne(id: number) {
    this.invoice = undefined;
    const res = await this.mainStore.api.get<Invoice>('/invoices/' + id);
    this.invoice = res.data;
  }

  protected async doPost(entity: Invoice): Promise<void> {
    const res = await this.mainStore.api.post<Invoice>('/invoices/', entity);
    this.invoice = res.data;
  }

  protected async doPut(entity: Invoice): Promise<void> {
    const res = await this.mainStore.api.put<Invoice>('/invoices/' + entity.id, entity);
    this.invoice = res.data;
  }

  protected async doDuplicate(id: number) {
    return this.mainStore.api.post<Invoice>('/invoices/' + id + '/duplicate');
  }
}
