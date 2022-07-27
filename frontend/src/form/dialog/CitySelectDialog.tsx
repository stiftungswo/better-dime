import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
import { LocationStore } from '../../stores/locationStore';
import { MainStore } from '../../stores/mainStore';
import { ServiceStore } from '../../stores/serviceStore';
import { Location, PositionGroupings, Service } from '../../types';
import compose from '../../utilities/compose';
import { defaultPositionGroup } from '../../utilities/helpers';
import { wrapIntl } from '../../utilities/wrapIntl';
import { PositionGroupSelect } from '../entitySelect/PositionGroupSelect';

interface Props {
  open: boolean;
  onClose: () => void;
  saveCallback?: (city: Location) => void;
  mainStore?: MainStore;
  locationStore?: LocationStore;
  intl?: IntlShape;
  path: string;
}

@compose(
  injectIntl,
  inject('mainStore'),
  inject('locationStore'),
  observer,
)
export default class CitySelectDialog extends React.Component<Props> {
  state = {
    save: false,
  };
  onClick = (city: Location) => () => {
    if (this.state.save) {
       this.props.saveCallback!(city);
    }
    this.props.onClose();
  }

  render() {
    const { onClose, open, saveCallback } = this.props;
    const intlText = wrapIntl(this.props.intl!, 'form.dialog.city_select');
    const cities = this.props.locationStore!.entities_sorted;
    const buildUrl = (cityId: string) => this.props.mainStore!.apiV2URL_localized(this.props.path, {city: cityId});

    return (
      <Dialog open onClose={onClose} maxWidth="lg">
        <DialogTitle>
          <FormHeader>
            <FormattedMessage id="form.dialog.city_select.title" />
          </FormHeader>
        </DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          <List>
            {cities.map(city => (
              <UnstyledBackendLink url={buildUrl(city.url)}>
                <ListItem button key={city.name} onClick={this.onClick(city)} >
                  <ListItemText primary={city.name}/>
                </ListItem>
              </UnstyledBackendLink>
            ))}
          </List>
          { saveCallback && (
            <FormControlLabel
              control={<Checkbox checked={this.state.save} onChange={e => this.setState({save: e.target.checked})} />}
              label={intlText('save_selection')}
            />
          )}
        </DialogContent>
      </Dialog>
    );
  }
}
