import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { withStyles, WithStyles } from '@mui/styles';
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

interface Props {
  open: boolean;
  onClose: () => void;
  onYes: () => void;
  onNo: () => void;
  intl?: IntlShape;
}

@compose(
  injectIntl,
)
export default class OfferPendingWarningDialog extends React.Component<Props> {
  render() {
    const { onClose, onYes, onNo, open } = this.props;
    const idPrefix = 'view.offer.pending_warning_dialog';
    const intlText = wrapIntl(this.props.intl!, idPrefix);

    return (
      <Dialog open onClose={onClose} maxWidth="xs">
        <DialogTitle>
          <FormHeader>
            <FormattedMessage id={idPrefix + '.title'} />
          </FormHeader>
        </DialogTitle>
        <DialogContent style={{ minWidth: '400px' }}>
          <FormattedMessage id={idPrefix + '.warning'} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            <FormattedMessage id={'general.action.cancel'} />
          </Button>
          <Button onClick={() => { onNo(); onClose(); }} color="primary">
            <FormattedMessage id={'general.no'} />
          </Button>
          <Button onClick={() => { onYes(); onClose(); }} color="primary" autoFocus>
            <FormattedMessage id={'general.yes'} />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
