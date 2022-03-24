import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { Address, Company } from 'src/types';
import { CompanyStore } from '../../stores/companyStore';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import CompanyForm from './CompanyForm';

interface PersonDetailRouterProps {
  id?: string;
}

export interface Props extends RouteComponentProps<PersonDetailRouterProps> {
  companyStore?: CompanyStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('companyStore'),
  observer,
)
export default class CompanyUpdate extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.companyStore!.fetchOne(Number(props.match.params.id));
  }

  handleSubmit = (company: Company) => {
    return this.props.companyStore!.put(company);
  }

  get company() {
    const company = this.props.companyStore!.company;
    if (company) {
      return {
        // it's important to detach the mobx proxy before passing it into formik
        // formik's deepClone can fall into endless recursions with those proxies.

        ...toJS(company),
        addresses: (company.addresses ? company.addresses : []).map((address: Address) => ({
          ...address,
          supplement: address.supplement || '',
        })),
      };
    } else {
      return undefined;
    }
  }

  render() {
    const company = this.company;
    const intlText = wrapIntl(this.props.intl!, 'view.person.update');
    const title = company ? `${company.name} - ` + intlText('general.company', true) : intlText('edit_customer');

    return <CompanyForm title={title} onSubmit={this.handleSubmit} company={company!} />;
  }
}
