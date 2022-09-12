import { IntlShape } from 'react-intl';

/*
 *  Helper function to reduce react-intl's intl.formatMessage boilerplate.
 *
 *  Instead of
 *
 *    const intl = this.props.intl!;
 *
 *    <DimeField [...] label={intl.formatMessage({id: 'view.offer.form.address'})} />
 *    <DimeField [...] label={intl.formatMessage({id: 'view.offer.form.accountant'})} />
 *    <DimeField [...] label={intl.formatMessage({id: 'view.offer.form.short_description'})} />
 *
 *
 *  you can now write
 *
 *    const intlText = wrapIntl(this.props.intl!, 'view.offer.form');
 *
 *    <Dimefield [...] label={intlText('address')} />
 *    <Dimefield [...] label={intlText('accountant')} />
 *    <Dimefield [...] label={intlText('short_description')} />
 *
 *
 *  so you can avoid having to copy-paste the 'view.offer.form' part everywhere.
 *  You can also ids that don't start with 'view.offer.form' as follows:
 *
 *    <Dimefield [...] label={intlText('general.offer', true)} />
 *
 *
 *  Note: For text that is displayed directly and not passed to a label argument,
 *  use <FormattedMessage id={...} /> instead!
 */

export const wrapIntl = (intl: IntlShape, idPrefix?: string) => (idSuffix: string, skipPrefix?: boolean, args?: any) => {
  const id = (idPrefix === undefined || skipPrefix) ? idSuffix : idPrefix + '.' + idSuffix;
  return intl.formatMessage({id, ...args});
};
export default wrapIntl;
