import React from 'react';
import { DimeAppBar } from '../../layout/DimeAppBar';
import { DimeContent, DimePaper } from '../../layout/DimeLayout';
import { Grid, Typography } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { CustomerTagSelector } from '../../form/entitySelector/CustomerTagSelector';
import { CustomerFilter } from '../../types';
import { FormProps, SwitchField } from '../../form/fields/common';
import { ExportFormatSelector } from '../../form/entitySelector/ExportFormatSelector';
import Button from '@material-ui/core/Button/Button';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { MainStore } from '../../stores/mainStore';

const initialValues: CustomerFilter = {
  customer_tags: [],
  export_format: 1,
  include_hidden: true,
};

interface Props extends FormProps {
  mainStore?: MainStore;
}

@compose(
  inject('mainStore'),
  observer
)
export class CustomerImportExportOverview extends React.Component<Props> {
  public render() {
    return (
      <>
        <DimeAppBar title={'Kundendaten importieren / exportieren'} />

        <DimeContent loading={false} paper={false}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <DimePaper>
                <Typography gutterBottom variant={'h5'}>
                  Daten exportieren
                </Typography>

                <Formik
                  initialValues={initialValues}
                  onSubmit={e => console.log(e)}
                  render={formikProps => (
                    <Grid container alignItems={'center'} spacing={24}>
                      <Grid item xs={12} md={4}>
                        <Field fullWidth component={CustomerTagSelector} label={'Kundentags auswählen'} name={'customer_tags'} />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Field fullWidth component={SwitchField} label={'Verstecke Kunden miteinbeziehen?'} name={'include_hidden'} />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Field fullWidth component={ExportFormatSelector} label={'Export-Format'} name={'export_format'} />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <a
                          href={
                            this.props.mainStore!.getPrintUrl('customers/export') +
                            '&customer_tags=' +
                            formikProps.values.customer_tags.join(',') +
                            '&include_hidden=' +
                            (formikProps.values.include_hidden ? '1' : '0') +
                            '&export_format=' +
                            formikProps.values.export_format
                          }
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

            <Grid item xs={12}>
              <DimePaper>
                <Typography gutterBottom variant={'h5'}>
                  Daten importieren
                </Typography>
                <a
                  href={this.props.mainStore!.getPrintUrl('customers/import/template')}
                  target={'_blank'}
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  <Button color={'primary'} variant="contained">
                    Import-Vorlage herunterladen
                  </Button>
                </a>
              </DimePaper>
            </Grid>
          </Grid>
        </DimeContent>
      </>
    );
  }
}
