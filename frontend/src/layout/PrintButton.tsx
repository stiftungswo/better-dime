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
    // after the async check resolves - as an unsolicited popup. The trade-off (a brief open-then-
    // close flicker on failure) is preferable to a PDF silently failing to open on the success path.
    const newTab = window.open('', '_blank');

    this.setState({ printing: true });

    try {
      // check=1 makes the backend run only its validations (no rendering) and answer 204, so a
      // failure shows as an in-app message. The PDF itself is then opened via its real URL rather
      // than a blob: URL, because the browser takes the suggested save name from the URL's
      // Content-Disposition header, which a blob: URL doesn't have ("document.pdf").
      await axios.get(mainStore!.apiV2URL_localized(path, { ...urlParams, check: 1 }), { responseType: 'blob' });

      if (newTab) {
        newTab.location.href = url;
      } else {
        // The popup was blocked even though window.open was called synchronously in the click
        // handler (e.g. a strict "block all popups" browser setting). The checks passed, so don't
        // just silently drop the PDF: offer a manual open via a real click, which - unlike a
        // programmatic window.open from here - always carries user activation and can't itself
        // be blocked.
        mainStore!.notifier.info(intl!.formatMessage({ id: 'layout.print_button.popup_blocked' }), {
          autoHideDuration: null,
          action: {
            label: intl!.formatMessage({ id: 'layout.print_button.open_pdf' }),
            onClick: () => {
              window.open(url, '_blank');
            },
          },
        });
      }
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
