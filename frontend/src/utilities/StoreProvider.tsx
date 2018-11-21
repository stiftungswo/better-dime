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
import { AddressStore } from '../stores/addressStore';
import { ProjectStore } from '../stores/projectStore';
import { ProjectCategoryStore } from '../stores/projectCategoryStore';
import { CustomerTagStore } from '../stores/customerTagStore';
import { InvoiceStore } from '../stores/invoiceStore';
import { CostgroupStore } from '../stores/costgroupStore';
import { EffortStore } from '../stores/effortStore';
import { ProjectCommentStore } from '../stores/projectCommentStore';
import { TimetrackFilterStore } from '../stores/timetrackFilterStore';

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
    addressStore: AddressStore;
    projectStore: ProjectStore;
    projectCategoryStore: ProjectCategoryStore;
    customerTagStore: CustomerTagStore;
    invoiceStore: InvoiceStore;
    costgroupStore: CostgroupStore;
    effortStore: EffortStore;
    projectCommentStore: ProjectCommentStore;
    timetrackFilterStore: TimetrackFilterStore;
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
      addressStore: new AddressStore(mainStore),
      projectStore: new ProjectStore(mainStore),
      projectCategoryStore: new ProjectCategoryStore(mainStore),
      customerTagStore: new CustomerTagStore(mainStore),
      invoiceStore: new InvoiceStore(mainStore),
      costgroupStore: new CostgroupStore(mainStore),
      effortStore: new EffortStore(mainStore, timetrackFilterStore),
      projectCommentStore: new ProjectCommentStore(mainStore, timetrackFilterStore),
    };
  }

  public render = () => {
    return <Provider {...this.stores}>{this.props.children}</Provider>;
  };
}
