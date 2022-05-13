import { History } from 'history';
import { IReactionDisposer, reaction } from 'mobx';
import { Provider } from 'mobx-react';
import * as React from 'react';
import { CompanyStore } from 'src/stores/companyStore';
import { PeopleStore } from 'src/stores/peopleStore';
import { ApiStore } from '../stores/apiStore';
import { CostgroupStore } from '../stores/costgroupStore';
import { CustomerImportStore } from '../stores/customerImportStore';
import { CustomerStore } from '../stores/customerStore';
import { CustomerTagStore } from '../stores/customerTagStore';
import { DailyReportStore } from '../stores/dailyReportStore';
import { EffortStore } from '../stores/effortStore';
import { EmployeeGroupStore } from '../stores/employeeGroupStore';
import { EmployeeStore } from '../stores/employeeStore';
import { GlobalSettingStore } from '../stores/globalSettingStore';
import { HolidayStore } from '../stores/holidayStore';
import { InvoiceStore } from '../stores/invoiceStore';
import { LocationStore } from '../stores/locationStore';
import { MainStore } from '../stores/mainStore';
import { OfferStore } from '../stores/offerStore';
import { PositionGroupStore } from '../stores/positionGroupStore';
import { ProjectCategoryStore } from '../stores/projectCategoryStore';
import { ProjectCommentPresetStore } from '../stores/projectCommentPresetStore';
import { ProjectCommentStore } from '../stores/projectCommentStore';
import { ProjectStore } from '../stores/projectStore';
import { ProjectWithPotentialInvoicesStore } from '../stores/projectWithPotentialInvoicesStore';
import { RateGroupStore } from '../stores/rateGroupStore';
import { RateUnitStore } from '../stores/rateUnitStore';
import { ServiceStore } from '../stores/serviceStore';
import { TimetrackFilterStore } from '../stores/timetrackFilterStore';
import { Formatter } from './formatter';
import { Notifier } from './notifier';

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
    projectWithPotentialInvoicesStore: ProjectWithPotentialInvoicesStore;
    projectCategoryStore: ProjectCategoryStore;
    customerTagStore: CustomerTagStore;
    invoiceStore: InvoiceStore;
    costgroupStore: CostgroupStore;
    effortStore: EffortStore;
    projectCommentStore: ProjectCommentStore;
    projectCommentPresetStore: ProjectCommentPresetStore;
    positionGroupStore: PositionGroupStore;
    timetrackFilterStore: TimetrackFilterStore;
    peopleStore: PeopleStore;
    companyStore: CompanyStore;
    customerImportStore: CustomerImportStore;
    dailyReportStore: DailyReportStore;
    globalSettingStore: GlobalSettingStore;
    employeeGroupStore: EmployeeGroupStore;
    locationStore: LocationStore;
  };
  private disposeAuthChangeReaction: IReactionDisposer;

  constructor(props: Props) {
    super(props);
    this.initializeStores();

    this.disposeAuthChangeReaction = reaction(
      () => this.stores.apiStore.tokenV2,
      tokenV2 => {
        if (tokenV2) {
          this.resetStores();
        }
      },
    );
  }

  componentWillUnmount(): void {
    if (this.disposeAuthChangeReaction) {
      this.disposeAuthChangeReaction();
    }
  }

  render = () => {
    return <Provider {...this.stores}>{this.props.children}</Provider>;
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
      projectCommentStore,
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
      projectWithPotentialInvoicesStore: new ProjectWithPotentialInvoicesStore(mainStore),
      projectCategoryStore: new ProjectCategoryStore(mainStore),
      customerTagStore: new CustomerTagStore(mainStore),
      invoiceStore: new InvoiceStore(mainStore),
      costgroupStore: new CostgroupStore(mainStore),
      effortStore,
      projectCommentStore,
      projectCommentPresetStore: new ProjectCommentPresetStore(mainStore),
      positionGroupStore: new PositionGroupStore(mainStore),
      peopleStore: new PeopleStore(mainStore),
      companyStore: new CompanyStore(mainStore),
      customerImportStore: new CustomerImportStore(mainStore),
      dailyReportStore: new DailyReportStore(mainStore),
      globalSettingStore: new GlobalSettingStore(mainStore),
      employeeGroupStore: new EmployeeGroupStore(mainStore),
      locationStore: new LocationStore(mainStore),
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
}
