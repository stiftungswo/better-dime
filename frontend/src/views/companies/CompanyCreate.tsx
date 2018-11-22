import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import CompanyForm from './CompanyForm';
import compose from '../../utilities/compose';
import { Company, CompanyStore } from 'src/stores/companyStore';

export interface Props extends RouteComponentProps {
  companyStore?: CompanyStore;
}

@compose(
  inject('companyStore'),
  observer
)
export default class CompanyCreate extends React.Component<Props> {
  state = {
    submitted: false,
  };

  public handleSubmit = (company: Company) =>
    this.props.companyStore!.post(company).then(() => {
      this.setState({ submitted: true });
      const idOfNewPerson = this.props!.companyStore!.company!.id;
      this.props.history.replace('/companies/' + idOfNewPerson);
    });

  public render() {
    const company: Company = {
      id: 0,
      comment: '',
      email: '',
      name: '',
      hidden: false,
      rate_group_id: 0,
      tags: [],
      addresses: undefined,
      phone_numbers: undefined,
    };

    return <CompanyForm title={'Firma erfassen'} onSubmit={this.handleSubmit} company={company} submitted={this.state.submitted} />;
  }
}
