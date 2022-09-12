import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { FormHeader } from '../../layout/FormHeader';
import UnstyledBackendLink from '../../layout/UnstyledBackendLink';
import { LocationStore } from '../../stores/locationStore';
import { MainStore } from '../../stores/mainStore';
import { Location, PositionGroupings, Service } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';

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
