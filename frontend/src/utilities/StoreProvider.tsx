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
  };

  constructor(props: Props) {
    super(props);

    const mainStore = new MainStore(this.props.history, this.props.enqueueSnackbar);

    this.stores = {
      mainStore,
      offerStore: new OfferStore(mainStore),
      employeeStore: new EmployeeStore(mainStore),
      serviceStore: new ServiceStore(mainStore),
      holidayStore: new HolidayStore(mainStore),
      rateUnitStore: new RateUnitStore(mainStore),
      rateGroupStore: new RateGroupStore(mainStore),
      addressStore: new AddressStore(mainStore),
      projectStore: new ProjectStore(mainStore),
    };
  }

  public render = () => {
    return <Provider {...this.stores}>{this.props.children}</Provider>;
  };
}
