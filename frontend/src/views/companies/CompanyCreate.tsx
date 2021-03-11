import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { CompanyStore } from 'src/stores/companyStore';
import { Company } from '../../types';
import compose from '../../utilities/compose';
import CompanyForm from './CompanyForm';

export interface Props extends RouteComponentProps {
  companyStore?: CompanyStore;
}

@compose(
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
    };

    return <CompanyForm title={'Firma erfassen'} onSubmit={this.handleSubmit} company={company} submitted={this.state.submitted} />;
  }
}
