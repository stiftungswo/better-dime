//tslint:disable:no-console
import { action, observable } from 'mobx';
import { AbstractStore } from './abstractStore';

interface CustomerImportSettings {
  customer_tags: number[];
  customers_to_import: NonPersistedImportCustomer[];
  hidden: boolean;
  file: Blob | undefined;
  rate_group_id: number;
}

export interface NonPersistedImportCustomer {
  city: string;
  comment: string | null;
  company_name: string | null;
  country: string | null;
  department: string | null;
  duplicate: boolean;
  email: string;
  fax: string;
  first_name: string | null;
  main_number: string | null;
  mobile_number: string | null;
  last_name: string | null;
  plz: number;
  type: string;
  salutation: string | null;
  street: string;
  supplement: string | null;
}

export class CustomerImportStore extends AbstractStore<NonPersistedImportCustomer> {
  @observable
  public importSettings?: CustomerImportSettings = {
    customer_tags: [],
    customers_to_import: [],
    hidden: false,
    file: undefined,
    rate_group_id: 1,
  };

  @observable
  public importIsLoading?: boolean = false;

  @action
  public async verifyImportFile(file: File, name: string) {
    try {
      this.importIsLoading = true;
      this.displayInProgress();
      const fileAsBlob = new Blob([file], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const formData = new FormData();
      formData.append('importFile', fileAsBlob, name);

      const res = await this.mainStore!.api.post<NonPersistedImportCustomer[]>('customers/import/verify', formData);
      this.importSettings!.customers_to_import = res.data;
      this.mainStore.displaySuccess('Kundenimport wurde erfolgreich überprüft.');
      this.importIsLoading = false;
    } catch (e) {
      this.importIsLoading = false;
      this.mainStore.displayError('Kundenimport konnte nicht überprüft werden.');
      console.log(e);
      throw e;
    }
  }
}
