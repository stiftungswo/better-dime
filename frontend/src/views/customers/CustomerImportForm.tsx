import React from 'react';
import { MainStore } from '../../stores/mainStore';
import { Card, CardActions, CardContent, CardHeader, Grid, Input, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import { DimePaper, LoadingSpinner } from '../../layout/DimeLayout';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Field, Formik } from 'formik';
import { SwitchField } from '../../form/fields/common';
import { CustomerTagSelector } from '../../form/entitySelector/CustomerTagSelector';
import { RateGroupSelector } from '../../form/entitySelector/RateGroupSelector';
import { CustomerImportStore } from '../../stores/customerImportStore';
import { CustomerImportPreviewCard } from './CustomerImportPreviewCard';

interface Props {
  customerImportStore?: CustomerImportStore;
  mainStore?: MainStore;
}

@compose(
  inject('customerImportStore', 'mainStore'),
  observer
)
export class CustomerImportForm extends React.Component<Props> {
  public removeItem = (indexOfItem: number) => {
    this.props.customerImportStore!.importSettings!.customers_to_import.splice(indexOfItem, 1);
  };

  public render() {
    const { customerImportStore } = this.props;

    return (
      <>
        <Grid item xs={12}>
          <DimePaper>
            <Typography gutterBottom variant={'h5'}>
              Daten importieren
            </Typography>

            <Formik
              initialValues={customerImportStore!.importSettings}
              onSubmit={e => console.log(e)}
              render={formikProps => (
                <>
                  <Grid container spacing={24} alignItems={'center'}>
                    <Grid item xs={12} md={4}>
                      <Field delayed fullWidth component={CustomerTagSelector} label={'Kundentags auswählen'} name={'customer_tags'} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Field delayed fullWidth component={SwitchField} name={'hidden'} label={'Kunden verstecken?'} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Field delayed fullWidth component={RateGroupSelector} label={'Tarifgruppe auswählen'} name={'rate_group_id'} />
                    </Grid>
                  </Grid>

                  <Grid container alignItems={'center'} spacing={24}>
                    <Grid item xs={12} md={4}>
                      <a
                        href={this.props.mainStore!.getPrintUrl('customers/import/template')}
                        target={'_blank'}
                        style={{ textDecoration: 'none', color: 'white' }}
                      >
                        <Button fullWidth color={'primary'} variant="contained">
                          Import-Vorlage herunterladen
                        </Button>
                      </a>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Field
                        component={Input}
                        type={'file'}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          this.props.customerImportStore!.verifyImportFile(
                            event.currentTarget.files![0],
                            event.currentTarget.files![0].name
                          );
                        }}
                        style={{ display: 'none' }}
                        id={'contained-button-file'}
                      />
                      <label htmlFor="contained-button-file">
                        <Button fullWidth variant="contained" component="span">
                          Import überprüfen
                        </Button>
                      </label>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Button
                        fullWidth
                        color={'secondary'}
                        variant={'contained'}
                        disabled={customerImportStore!.importSettings!.customers_to_import.length <= 0}
                      >
                        Import starten
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
            />
          </DimePaper>
        </Grid>

        {customerImportStore!.importIsLoading && <LoadingSpinner />}
        {!customerImportStore!.importIsLoading &&
          customerImportStore!.importSettings!.customers_to_import.map((nonPersistedCustomer, index: number) => (
            <Grid item xs={12} md={4} key={index}>
              <CustomerImportPreviewCard customerPreview={nonPersistedCustomer} index={index} removeItem={this.removeItem} />
            </Grid>
          ))}
      </>
    );
  }
}
