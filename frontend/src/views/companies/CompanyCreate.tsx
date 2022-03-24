import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps } from 'react-router';
import { CompanyStore } from 'src/stores/companyStore';
import { Company } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import CompanyForm from './CompanyForm';

export interface Props extends RouteComponentProps {
  companyStore?: CompanyStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('companyStore'),
  observer,
)
export default class CompanyCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  handleSubmit = (company: Company) =>
    this.props.companyStore!.post(company).then(() => {
      this.setState({ submitted: true });
      const idOfNewPerson = this.props!.companyStore!.company!.id;
      this.props.history.replace('/companies/' + idOfNewPerson);
    })

  render() {
    const intlText = wrapIntl(this.props.intl!, 'view.company.create');
    const company: Company = {
      type: 'company',
      id: 0,
      comment: '',
      email: '',
      name: '',
      accountant_id: null,
      hidden: false,
      rate_group_id: 0,
      tags: [],
      addresses: [],
      phone_numbers: [],
      archived: false,
    };

    return <CompanyForm title={intlText('title')} onSubmit={this.handleSubmit} company={company} submitted={this.state.submitted} />;
  }
}
