import compose from './compose';
import { InjectedNotistackProps, withSnackbar } from 'notistack';
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

export interface Props extends InjectedNotistackProps {
  history: History;
}

@compose(withSnackbar)
export class StoreProvider extends React.Component<Props | any> {
  private stores: {
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
  };

  constructor(props: Props) {
    super(props);

    const mainStore = new MainStore(this.props.history, this.props.enqueueSnackbar);
    const timetrackFilterStore = new TimetrackFilterStore(mainStore);

    this.stores = {
      mainStore,
      timetrackFilterStore,
      offerStore: new OfferStore(mainStore),
      employeeStore: new EmployeeStore(mainStore),
      serviceStore: new ServiceStore(mainStore),
      holidayStore: new HolidayStore(mainStore),
      rateUnitStore: new RateUnitStore(mainStore),
      rateGroupStore: new RateGroupStore(mainStore),
      customerStore: new CustomerStore(mainStore),
      projectStore: new ProjectStore(mainStore),
      projectCategoryStore: new ProjectCategoryStore(mainStore),
      customerTagStore: new CustomerTagStore(mainStore),
      invoiceStore: new InvoiceStore(mainStore),
      costgroupStore: new CostgroupStore(mainStore),
      effortStore: new EffortStore(mainStore, timetrackFilterStore),
      projectCommentStore: new ProjectCommentStore(mainStore, timetrackFilterStore),
      peopleStore: new PeopleStore(mainStore),
      companyStore: new CompanyStore(mainStore),
    };
  }

  public render = () => {
    return <Provider {...this.stores}>{this.props.children}</Provider>;
  };
}
