import compose from '../compose';
import { InjectedNotistackProps, withSnackbar } from 'notistack';
import * as React from 'react';
import { MainStore } from '../store/mainStore';
import { OfferStore } from '../store/offerStore';
import { EmployeeStore } from '../store/employeeStore';
import { ServiceStore } from '../store/serviceStore';
import { Provider } from 'mobx-react';
import { History } from 'history';

interface Props extends InjectedNotistackProps {
  history: History;
}

export const StoreProvider = compose(withSnackbar)(
  class extends React.Component<Props> {
    private stores: { mainStore: MainStore; offerStore: OfferStore; employeeStore: EmployeeStore; serviceStore: ServiceStore };

    constructor(props: Props) {
      super(props);

      const mainStore = new MainStore(this.props.history, this.props.enqueueSnackbar);

      this.stores = {
        mainStore,
        offerStore: new OfferStore(mainStore),
        employeeStore: new EmployeeStore(mainStore),
        serviceStore: new ServiceStore(mainStore),
      };
    }

    public render = () => {
      return <Provider {...this.stores}>{this.props.children}</Provider>;
    };
  }
);
