import { computed, observable } from 'mobx';
import { MainStore } from './mainStore';
import { AbstractStore } from './abstractStore';
import { Service } from '../types';
import { ServiceListing } from '../types';

export interface GlobalSettings {
  sender_name: string;
  sender_street: string;
  sender_zip: string;
  sender_city: string;
  sender_phone: string;
  sender_mail: string;
  sender_vat: string;
  sender_bank: string;
  sender_bank_detail: string;
  sender_bank_iban: string;
  sender_bank_bic: string;
  sender_web: string;
  service_order_comment: string;
}

export class GlobalSettingStore extends AbstractStore<GlobalSettings> {
  protected get entityName() {
    return {
      singular: 'Die Einstellungen', // that's correct, we're saving the whole set of settigns (which is one entity)
      plural: 'Die Einstellungen',
    };
  }

  @computed
  public get entity(): GlobalSettings | undefined {
    return this.settings;
  }

  public set entity(settings: GlobalSettings | undefined) {
    this.settings = settings;
  }

  @observable
  public settings?: GlobalSettings = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
  }

  protected async doPut(entity: GlobalSettings): Promise<void> {
    const res = await this.mainStore.api.put('/global_settings', entity);
    this.settings = res.data;
  }

  protected async doFetchOne() {
    const res = await this.mainStore.api.get<GlobalSettings>('/global_settings');
    this.settings = res.data;
  }
}
