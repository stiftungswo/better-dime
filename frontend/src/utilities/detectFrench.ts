import { IntlShape } from 'react-intl';

/*
 *  Helper function to figure out whether the active locale is french.
 *
 */

export const detectFrench = (intl: IntlShape) =>
  (intl.formatMessage({id: 'language.display_name'}).startsWith('F'));
export default detectFrench;
