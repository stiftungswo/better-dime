import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { DimePaper } from '../../layout/DimePaper';
import { FormHeader } from '../../layout/FormHeader';
import UnstyledBackendLink from '../../layout/UnstyledBackendLink';
import { AbstractStore } from '../../stores/abstractStore';
import { MainStore } from '../../stores/mainStore';
import { ServiceStore } from '../../stores/serviceStore';
import { PositionGroupings, Service } from '../../types';
import compose from '../../utilities/compose';
import { defaultPositionGroup } from '../../utilities/helpers';
import { wrapIntl } from '../../utilities/wrapIntl';
import { PositionGroupSelect } from '../entitySelect/PositionGroupSelect';
import { ServiceSelect } from '../entitySelect/ServiceSelect';

interface Props {
  open: boolean;
  onClose: () => void;
  mainStore?: MainStore;
  intl?: IntlShape;
  path: string;
}

@compose(
  injectIntl,
  inject('mainStore'),
  observer,
)
export default class CitySelectDialog extends React.Component<Props> {
  render() {
    const { onClose, open } = this.props;
    const intlText = wrapIntl(this.props.intl!, 'form.dialog.city_select');
    const cities = [
      {id: 'basel', url: 'Basel'},
      {id: 'schwerzenbach', url: 'Schwerzenbach'},
      {id: 'wallis', url: 'Sierre'},
    ];
    const buildUrl = (cityId: string) => this.props.mainStore!.apiV2URL(this.props.path, {city: cityId});

    return (
      <Dialog open onClose={onClose} maxWidth="lg">
        <DialogTitle>
          <FormHeader>
            <FormattedMessage id="form.dialog.city_select.title" />
          </FormHeader>
        </DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          <List>
            <UnstyledBackendLink url={buildUrl('')}>
              <ListItem button key="" onClick={onClose}>
                <ListItemText primary={intlText('none')}/>
              </ListItem>
            </UnstyledBackendLink>
            {cities.map(city => (
              <UnstyledBackendLink url={buildUrl(city.url)}>
                <ListItem button key={city.id} onClick={onClose} >
                  <ListItemText primary={intlText(city.id)}/>
                </ListItem>
              </UnstyledBackendLink>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    );
  }
}
