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
import { DimePaper } from '../layout/DimePaper';
import { FormHeader } from '../layout/FormHeader';
import {AbstractStore} from '../stores/abstractStore';
import { MainStore } from '../stores/mainStore';
import { ServiceStore } from '../stores/serviceStore';
import {PositionGroupings, Service} from '../types';
import compose from '../utilities/compose';
import {defaultPositionGroup} from '../utilities/helpers';
import {PositionGroupSelect} from './entitySelect/PositionGroupSelect';
import { ServiceSelect } from './entitySelect/ServiceSelect';

interface Props {
  open: boolean;
  onClose: () => void;
  mainStore?: MainStore;
  path: string;
}

@compose(
  inject('mainStore'),
  observer,
)
export default class CitySelectDialog extends React.Component<Props> {
  render() {
    const { onClose, open } = this.props;
    const cities = [
      {name: 'Basel', url: 'Basel'},
      {name: 'Schwerzenbach', url: 'Schwerzenbach'},
      {name: 'Sierre (Wallis)', url: 'Sierre'},
    ];
    const buildUrl = (cityId: string) => this.props.mainStore!.apiV2URL(this.props.path, {city: cityId});

    return (
      <Dialog open onClose={onClose} maxWidth="lg">
        <DialogTitle>
          <FormHeader>Ort für Unterschrift auswählen</FormHeader>
        </DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          <List>
            <a href={buildUrl('')} target={'_blank'} style={{ color: 'white' }}>
              <ListItem button key="" onClick={onClose}>
                <ListItemText primary="<kein Ort>" />
              </ListItem>
            </a>
            {cities.map(city => (
              <a href={buildUrl(city.url)} target={'_blank'} style={{ color: 'white' }}>
                <ListItem button key={city.name} onClick={onClose}>
                  <ListItemText primary={city.name} />
                </ListItem>
              </a>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    );
  }
}
