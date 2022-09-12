import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { CustomerTagSelect } from '../../form/entitySelect/CustomerTagSelect';
import { DimeField } from '../../form/fields/formik';
import { ActionButtons } from '../../layout/ActionButtons';
import { DimePaper } from '../../layout/DimePaper';
import { CloseIcon, ExpandMoreIcon, MailIcon } from '../../layout/icons';
import Overview, { Column } from '../../layout/Overview';
import { CustomerTagStore } from '../../stores/customerTagStore';
import { MainStore } from '../../stores/mainStore';
import { PeopleStore } from '../../stores/peopleStore';
import { CustomerOverviewFilter, Person, SelectedAction } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';
import PersonFilterForm from './PersonFilterForm';

type Props = {
  customerTagStore?: CustomerTagStore;
  mainStore?: MainStore;
  peopleStore?: PeopleStore;
  intl?: IntlShape;
} & RouteComponentProps;

@compose(
  injectIntl,
  inject('customerTagStore', 'peopleStore', 'mainStore'),
  observer,
  withRouter,
)
export default class PersonOverview extends React.Component<Props> {
  componentDidMount() {
    this.props.peopleStore!.selectedIds.clear();
  }

  copyMails = async (totalSelectedIds: number[]) => {
    const people = await this.props.peopleStore!.doReturnAll();
    const selectedPeople = people.filter((p) => totalSelectedIds.includes(p.id));
    const emails = selectedPeople.map(p => p.email).filter(e => e !== '');
    if (emails.length > 0) {
      // copy emails to clipboard
      const dummy = document.createElement('input');
      document.body.appendChild(dummy);
      dummy.setAttribute('id', 'dummy_id');
      (document.getElementById('dummy_id') as HTMLInputElement).value = emails.toString();
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
      this.props.mainStore!.displaySuccess(`${emails.length} E-Mail Adresse${emails.length === 1 ? '' : 'n'} wurden erfolgreich in die Zwischenablage kopiert.`);
      window.location.href = `mailto:${emails.toString()}`;
    } else {
      this.props.mainStore!.displayError('Alle ausgewählten Personen besitzen keine E-Mail Adresse.');
    }
  }

  deSelect = async (totalSelectedIds: number[]) => {
    const people = await this.props.peopleStore!.doReturnAll();
    const selectedPeople = people.filter((p) => totalSelectedIds.includes(p.id));
    selectedPeople.forEach((p) => {
      this.setSelectedPeople(p, false);
    });
  }

  setSelectedPeople = (person: Person, state: boolean) => {
    this.props.peopleStore!.selectedIds.set(person.id, state);
  }

  render() {
    const peopleStore = this.props.peopleStore;
    const intlText = wrapIntl(this.props.intl!, 'view.person.overview');

    const selectedAction1: SelectedAction = {
      icon: MailIcon,
      title: intlText('open_email'),
      action: this.copyMails,
    };

    const selectedAction2: SelectedAction = {
      icon: CloseIcon,
      title: intlText('cancel_selection'),
      action: this.deSelect,
    };

    const columns: Array<Column<Person>> = [
      {
        id: 'first_name',
        label: intlText('first_name'),
      },
      {
        id: 'last_name',
        label: intlText('last_name'),
      },
      {
        id: 'email',
        label: 'E-Mail',
      },
      {
        id: 'company_id',
        noSort: true,
        label: intlText('general.company', true),
        format: p => <>{p.company ? p.company.name : ''}</>,
      },
    ];

    return (
      <Overview
        archivable
        searchable
        paginated
        title={intlText('general.person.plural', true)}
        store={peopleStore!}
        addAction={'/persons/new'}
        setSelected={this.setSelectedPeople}
        hasSelect={true}
        renderActions={e => (
          <ActionButtons
            copyAction={async () => {
              if (e.id) {
                const newEntity: Person = await peopleStore!.duplicate(e.id);
                this.props.history.push(`/persons/${newEntity.id}`);
              }
            }}
            archiveAction={(!e.archived && e.id) ? () => peopleStore!.archive(e.id!, true).then(r => peopleStore!.fetchAllPaginated()) : undefined}
            restoreAction={(e.archived && e.id) ? () => peopleStore!.archive(e.id!, false).then(r => peopleStore!.fetchAllPaginated()) : undefined}
            deleteMessage={intlText('delete_warning')}
            deleteAction={() => {
              if (e.id) {
                peopleStore!.delete(e.id).then(r => peopleStore!.fetchAllPaginated());
              }
            }}
          />
        )}
        selectedActions={[selectedAction2, selectedAction1]}
        onClickRow={'/persons/:id'}
        columns={columns}
      >
        <PersonFilterForm store={this.props.peopleStore!}/>
      </Overview>
    );
  }
}
