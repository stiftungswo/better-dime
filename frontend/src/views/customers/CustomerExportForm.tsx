import { Grid, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import { Formik } from 'formik';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { CustomerTagSelect } from '../../form/entitySelect/CustomerTagSelect';
import { ExportFormatSelect } from '../../form/entitySelect/ExportFormatSelect';
import { SwitchField } from '../../form/fields/common';
import { DimeField } from '../../form/fields/formik';
import { DimePaper } from '../../layout/DimePaper';
import { MainStore } from '../../stores/mainStore';
import { CustomerFilter } from '../../types';
import compose from '../../utilities/compose';

const initialValues: CustomerFilter = {
  customer_tags: [],
  export_format: 1,
  include_hidden: true,
};

interface Props {
  mainStore?: MainStore;
}

@compose(
  inject('mainStore'),
  observer,
)
export class CustomerExportForm extends React.Component<Props> {
  render() {
    return (
      <Grid item xs={12}>
        <DimePaper>
          <Typography gutterBottom variant={'h5'}>
            Daten exportieren
          </Typography>

          <Formik
            initialValues={initialValues}
            onSubmit={() => {}} // tslint:disable-line:no-empty
            render={formikProps => (
              <Grid container alignItems={'center'} spacing={6}>
                <Grid item xs={12} md={4}>
                  <DimeField delayed component={CustomerTagSelect} label={'Kundentags auswählen'} name={'customer_tags'} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DimeField delayed component={SwitchField} label={'Verstecke Kunden miteinbeziehen?'} name={'include_hidden'} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <DimeField delayed component={ExportFormatSelect} label={'Export-Format'} name={'export_format'} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <a
                    href={this.props.mainStore!.apiURL('customers/export', {
                      customer_tags: formikProps.values.customer_tags.join(','),
                      include_hidden: formikProps.values.include_hidden ? '1' : '0',
                      export_format: formikProps.values.export_format,
                    })}
                    target={'_blank'}
                    style={{ textDecoration: 'none', color: 'white' }}
                  >
                    <Button color={'primary'} variant="contained">
                      Herunterladen
                    </Button>
                  </a>
                </Grid>
              </Grid>
            )}
          />
        </DimePaper>
      </Grid>
    );
  }
}
