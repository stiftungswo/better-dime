import { PropTypes } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import CitySelectDialog from '../form/dialog/CitySelectDialog';
import { MainStore } from '../stores/mainStore';
import { Location } from '../types';
import compose from '../utilities/compose';
import { ActionButton } from './ActionButton';
import { PrintIcon } from './icons';
import UnstyledBackendLink from './UnstyledBackendLink';

interface Props {
  intl?: IntlShape;
  icon?: React.ReactType<SvgIconProps>;
  path: string;
  disabled?: boolean;
  hasCitySelection?: boolean;
  citySelectionSaveCallback?: (city: Location) => void;
  color?: PropTypes.Color;
  mainStore?: MainStore;
  title?: string;
  urlParams?: object;
  // Fetches the PDF as a blob via XHR instead of a plain <a target="_blank"> navigation, so a
  // backend failure (e.g. a validation error) shows as an in-app message instead of a raw,
  // unstyled error response in a blank new tab.
  handleErrors?: boolean;
}

@compose(
  injectIntl,
  inject('mainStore'),
  observer,
)
export default class PrintButton extends React.Component<Props> {
  state = {
    cityDialogOpen: false,
    printing: false,
  };

  // A plain instance field, not this.state.printing: the disabled prop derived from state only
  // takes effect after the next render, but print() calls window.open synchronously before that,
  // so a rapid double-click could otherwise fire it twice and open two tabs.
  printInFlight = false;

  print = async () => {
    if (this.printInFlight) {
      return;
    }
    this.printInFlight = true;

    const { mainStore, path, urlParams, intl } = this.props;
    const url = mainStore!.apiV2URL_localized(path, urlParams);
    // Open the tab synchronously, within the click handler, so popup blockers (Safari in
    // particular) don't treat the later window.open-equivalent redirect - which happens only
    // after the async fetch resolves - as an unsolicited popup. The trade-off (a brief open-then-
    // close flicker on failure) is preferable to a PDF silently failing to open on the success path.
    const newTab = window.open('', '_blank');

    this.setState({ printing: true });

    try {
      const response = await axios.get<Blob>(url, { responseType: 'blob' });
      const objectUrl = URL.createObjectURL(response.data);

      if (newTab) {
        newTab.location.href = objectUrl;
      }
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    } catch (error) {
      if (newTab) {
        newTab.close();
      }
      mainStore!.displayError(await this.extractErrorMessage(error));
    } finally {
      this.printInFlight = false;
      this.setState({ printing: false });
    }
  }

  extractErrorMessage = async (error: any): Promise<string> => {
    const fallback = this.props.intl!.formatMessage({ id: 'layout.print_button.failed' });
    const data = error?.response?.data;

    if (!(data instanceof Blob)) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(await data.text());
      if (Array.isArray(parsed.human_readable_descriptions) && parsed.human_readable_descriptions.length > 0) {
        return parsed.human_readable_descriptions.join(' ');
      }
    } catch {
      // not JSON (e.g. an HTML error page) - fall through to the generic message
    }

    return fallback;
  }

  render() {
    const BadgeIcon = this.props.icon;
    const printLabel = this.props.intl!.formatMessage({id: 'layout.print_button.print'});
    if (this.props.disabled) {
      return (
        <ActionButton disabled icon={PrintIcon} secondaryIcon={BadgeIcon} title={this.props.title || printLabel} color={this.props.color} />
      );
    } else if (this.props.hasCitySelection) {
      return (
       <>
          <ActionButton
            icon={PrintIcon}
            secondaryIcon={BadgeIcon}
            title={this.props.title || printLabel}
            color={this.props.color}
            action={() => this.setState({ cityDialogOpen: true })}
            disabled={false}
          />
          {this.state.cityDialogOpen && (
            <CitySelectDialog open path={this.props.path} onClose={() => this.setState({ cityDialogOpen: false })} saveCallback={this.props.citySelectionSaveCallback}/>
          )}
       </>
      );
    } else if (this.props.handleErrors) {
      return (
        <ActionButton
          icon={PrintIcon}
          secondaryIcon={BadgeIcon}
          title={this.props.title || printLabel}
          color={this.props.color}
          action={this.print}
          disabled={this.state.printing}
        />
      );
    } else {
      return (
        <UnstyledBackendLink url={this.props.mainStore!.apiV2URL_localized(this.props.path, this.props.urlParams)}>
          <ActionButton
            icon={PrintIcon}
            secondaryIcon={BadgeIcon}
            title={this.props.title || printLabel}
            color={this.props.color}
            disabled={false}
          />
        </UnstyledBackendLink>
      );
    }
  }
}
