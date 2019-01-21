import * as React from 'react';
import { MainStore } from '../stores/mainStore';
import { OfferStore } from '../stores/offerStore';
import { EmployeeStore } from '../stores/employeeStore';
import { ServiceStore } from '../stores/serviceStore';
import { Provider } from 'mobx-react';
import { History } from 'history';
import { HolidayStore } from '../stores/holidayStore';
import { RateUnitStore } from '../stores/rateUnitStore';
import { RateGroupStore } from '../stores/rateGroupStore';
import { CustomerStore } from '../stores/customerStore';
import { ProjectStore } from '../stores/projectStore';
import { ProjectCategoryStore } from '../stores/projectCategoryStore';
import { CustomerTagStore } from '../stores/customerTagStore';
import { InvoiceStore } from '../stores/invoiceStore';
import { CostgroupStore } from '../stores/costgroupStore';
import { EffortStore } from '../stores/effortStore';
import { ProjectCommentStore } from '../stores/projectCommentStore';
import { TimetrackFilterStore } from '../stores/timetrackFilterStore';
import { PeopleStore } from 'src/stores/peopleStore';
import { CompanyStore } from 'src/stores/companyStore';
import { CustomerImportStore } from '../stores/customerImportStore';
import { DailyReportStore } from '../stores/dailyReportStore';
import { ApiStore } from '../stores/apiStore';
import { Formatter } from './formatter';
import { Notifier } from './notifier';
import { IReactionDisposer, reaction } from 'mobx';
import { GlobalSettingStore } from '../stores/globalSettingStore';
import { EmployeeGroupStore } from '../stores/employeeGroupStore';

export interface Props {
  history: History;
}

export class StoreProvider extends React.Component<Props> {
  private stores: {
    notifier: Notifier;
    formatter: Formatter;
    apiStore: ApiStore;
    mainStore: MainStore;
    offerStore: OfferStore;
    employeeStore: EmployeeStore;
    serviceStore: ServiceStore;
    holidayStore: HolidayStore;
    rateUnitStore: RateUnitStore;
    rateGroupStore: RateGroupStore;
    customerStore: CustomerStore;
    projectStore: ProjectStore;
    projectCategoryStore: ProjectCategoryStore;
    customerTagStore: CustomerTagStore;
    invoiceStore: InvoiceStore;
    costgroupStore: CostgroupStore;
    effortStore: EffortStore;
    projectCommentStore: ProjectCommentStore;
    timetrackFilterStore: TimetrackFilterStore;
    peopleStore: PeopleStore;
    companyStore: CompanyStore;
    customerImportStore: CustomerImportStore;
    dailyReportStore: DailyReportStore;
    globalSettingStore: GlobalSettingStore;
    employeeGroupStore: EmployeeGroupStore;
  };
  private disposeAuthChangeReaction: IReactionDisposer;

  constructor(props: Props) {
    super(props);
    this.initializeStores();

    this.disposeAuthChangeReaction = reaction(
      () => this.stores.apiStore.token,
      token => {
        if (token) {
          this.resetStores();
        }
      }
    );
  }

  componentWillUnmount(): void {
    if (this.disposeAuthChangeReaction) {
      this.disposeAuthChangeReaction();
    }
  }

  private initializeStores() {
    const apiStore = new ApiStore(this.props.history);
    const formatter = new Formatter(apiStore);
    const notifier = new Notifier();
    const mainStore = new MainStore(apiStore, formatter, notifier, this.props.history);
    const employeeStore = new EmployeeStore(mainStore);
    const serviceStore = new ServiceStore(mainStore);
    const projectStore = new ProjectStore(mainStore);
    const effortStore = new EffortStore(mainStore);
    const projectCommentStore = new ProjectCommentStore(mainStore);
    const timetrackFilterStore = new TimetrackFilterStore(
      mainStore,
      employeeStore,
      projectStore,
      serviceStore,
      effortStore,
      projectCommentStore
    );

    this.stores = {
      notifier,
      formatter,
      apiStore,
      mainStore,
      timetrackFilterStore,
      offerStore: new OfferStore(mainStore),
      employeeStore,
      serviceStore,
      holidayStore: new HolidayStore(mainStore),
      rateUnitStore: new RateUnitStore(mainStore),
      rateGroupStore: new RateGroupStore(mainStore),
      customerStore: new CustomerStore(mainStore),
      projectStore,
      projectCategoryStore: new ProjectCategoryStore(mainStore),
      customerTagStore: new CustomerTagStore(mainStore),
      invoiceStore: new InvoiceStore(mainStore),
      costgroupStore: new CostgroupStore(mainStore),
      effortStore,
      projectCommentStore,
      peopleStore: new PeopleStore(mainStore),
      companyStore: new CompanyStore(mainStore),
      customerImportStore: new CustomerImportStore(mainStore),
      dailyReportStore: new DailyReportStore(mainStore),
      globalSettingStore: new GlobalSettingStore(mainStore),
      employeeGroupStore: new EmployeeGroupStore(mainStore),
    };
  }

  private resetStores() {
    Object.keys(this.stores).forEach(name => {
      const store = this.stores[name];
      if (store.reset) {
        store.reset();
      }
    });
  }

  public render = () => {
    return <Provider {...this.stores}>{this.props.children}</Provider>;
  };
}
