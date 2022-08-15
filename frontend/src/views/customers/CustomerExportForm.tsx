import { Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Formik } from 'formik';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { CustomerTagSelect } from '../../form/entitySelect/CustomerTagSelect';
import { ExportFormatSelect } from '../../form/entitySelect/ExportFormatSelect';
import { SwitchField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { DimePaper } from '../../layout/DimePaper';
import { MainStore } from '../../stores/mainStore';
import { CustomerExportFilter } from '../../types';
import compose from '../../utilities/compose';
import { wrapIntl } from '../../utilities/wrapIntl';

const initialValues: CustomerExportFilter = {
  customer_tags: [],
  export_format: 1,
  showArchived: true,
};

interface Props {
  mainStore?: MainStore;
  intl?: IntlShape;
}

@compose(
  injectIntl,
  inject('mainStore'),
  observer,
)
export class CustomerExportForm extends React.Component<Props> {
  render() {
    const idPrefix = 'view.customer.export_form';
    const intlText = wrapIntl(this.props.intl!, idPrefix);
    return (
      <Grid item xs={12}>
        <DimePaper>
          <Typography gutterBottom variant={'h5'}>
            <FormattedMessage id={idPrefix + '.title'} />
          </Typography>

          <Formik
            initialValues={initialValues}
            onSubmit={() => {}} // tslint:disable-line:no-empty
          >
            {formikProps => (
              <Grid container alignItems={'center'} spacing={3}>
                <Grid item xs={12} md={4}>
                  <DimeField delayed component={CustomerTagSelect} label={intlText('select_tags')} name={'customer_tags'} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DimeField delayed component={SwitchField} label={intlText('show_archived')} name={'showArchived'} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DimeField delayed component={ExportFormatSelect} label={intlText('select_export_format')} name={'export_format'} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <a
                    href={this.props.mainStore!.apiV2URL('customers/export' + (formikProps.values.export_format === 1 ? '.txt' : '.xlsx'), {
                      customer_tags: formikProps.values.customer_tags.join(','),
                      showArchived: formikProps.values.showArchived ? '1' : '0',
                    })}
                    target={'_blank'}
                    style={{ textDecoration: 'none', color: 'white' }}
                  >
                    <Button color={'primary'} variant="contained">
                      <FormattedMessage id="general.action.download" />
                    </Button>
                  </a>
                </Grid>
              </Grid>
            )}
          </Formik>
        </DimePaper>
      </Grid>
    );
  }
}
