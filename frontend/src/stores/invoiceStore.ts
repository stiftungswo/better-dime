import { observable } from 'mobx';
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
    const res = await this.mainStore.api.post<Invoice>('/invoices/', this.cast(entity));
    this.invoice = res.data;
  }

  protected async doPut(entity: Invoice): Promise<void> {
    const res = await this.mainStore.api.put<Invoice>('/invoices/' + entity.id, this.cast(entity));
    this.invoice = res.data;
  }

  protected cast(invoice: Invoice) {
    //this prevents empty fields being sent to the backend as ""
    //optimally, this can be handled in the form so empty strings don't even reach here.
    return {
      ...invoice,
      fixed_price: invoice.fixed_price || null,
      positions: invoice.positions.map(p => ({
        ...p,
        order: p.order === '' ? null : p.order,
      })),
    };
  }
}
