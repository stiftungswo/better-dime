import { action, computed, makeObservable, observable } from 'mobx';
import { AbstractStore } from './abstractStore';
import { MainStore } from './mainStore';

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
  get entity(): GlobalSettings | undefined {
    return this.settings;
  }

  set entity(settings: GlobalSettings | undefined) {
    this.settings = settings;
  }

  @observable
  settings?: GlobalSettings = undefined;

  constructor(mainStore: MainStore) {
    super(mainStore);
    makeObservable(this);
  }

  protected async doPut(entity: GlobalSettings): Promise<void> {
    this.mainStore.apiV2.put('/global_settings', entity).then(
      action(res => { this.settings = res.data; }),
    );
  }

  protected async doFetchOne() {
    this.mainStore.apiV2.get<GlobalSettings>('/global_settings').then(
      action(res => { this.settings = res.data; }),
    );
  }
}
