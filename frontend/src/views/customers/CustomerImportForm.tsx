import React from 'react';
import { MainStore } from '../../stores/mainStore';
import { Grid, Input, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button/Button';
import { LoadingSpinner } from '../../layout/LoadingSpinner';
import compose from '../../utilities/compose';
import { inject, observer } from 'mobx-react';
import { Formik } from 'formik';
import { SwitchField } from '../../form/fields/common';
import { CustomerTagSelect } from '../../form/entitySelect/CustomerTagSelect';
import { RateGroupSelect } from '../../form/entitySelect/RateGroupSelect';
import { CustomerImportSettings, CustomerImportStore, NonPersistedImportCustomer } from '../../stores/customerImportStore';
import { CustomerImportPreviewCard } from './CustomerImportPreviewCard';
import { CustomerImportFAQ } from './CustomerImportFAQ';
import { DimePaper } from '../../layout/DimePaper';
import { DimeField } from '../../form/fields/formik';

interface Props {
  customerImportStore?: CustomerImportStore;
  mainStore?: MainStore;
}

interface CustomerImportFormState {
  faqOpen: boolean;
}

@compose(
  inject('customerImportStore', 'mainStore'),
  observer
)
export class CustomerImportForm extends React.Component<Props, CustomerImportFormState> {
  public state = {
    faqOpen: false,
  };

  public handleSubmit = (importSettings: CustomerImportSettings | undefined) => {
    this.props.customerImportStore!.doImport(importSettings).then(() => {
      this.props.customerImportStore!.customersToImport = [];
    });
  };

  public removeCustomer = (indexOfItem: number) => {
    this.props.customerImportStore!.customersToImport!.splice(indexOfItem, 1);
  };

  public render() {
    const { customerImportStore } = this.props;

    return (
      <>
        <Grid item xs={12}>
          <DimePaper>
            <Grid justify="space-between" container spacing={24} alignItems={'center'}>
              <Grid item>
                <Typography gutterBottom variant={'h5'}>
                  Daten importieren
                </Typography>
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  component="span"
                  onClick={() => {
                    this.setState({ faqOpen: !this.state.faqOpen });
                  }}
                >
                  FAQ zum Import {this.state.faqOpen ? 'schliessen' : 'öffnen'}
                </Button>
              </Grid>
            </Grid>

            <CustomerImportFAQ open={this.state.faqOpen} />

            <Formik
              initialValues={customerImportStore!.importSettings}
              onSubmit={e => this.handleSubmit(e)}
              render={formikProps => (
                <form onSubmit={formikProps.handleSubmit}>
                  <Grid container spacing={24} alignItems={'center'}>
                    <Grid item xs={12} md={4}>
                      <DimeField delayed component={CustomerTagSelect} label={'Kundentags auswählen'} name={'customer_tags'} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <DimeField delayed component={SwitchField} name={'hidden'} label={'Kunden verstecken?'} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <DimeField delayed component={RateGroupSelect} label={'Tarifgruppe auswählen'} name={'rate_group_id'} />
                    </Grid>
                  </Grid>

                  <Grid container alignItems={'center'} spacing={24}>
                    <Grid item xs={12} md={4}>
                      <a
                        href={this.props.mainStore!.apiURL('customers/import/template')}
                        target={'_blank'}
                        style={{ textDecoration: 'none', color: 'white' }}
                      >
                        <Button fullWidth color={'primary'} variant="contained">
                          Import-Vorlage herunterladen
                        </Button>
                      </a>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Input
                        type={'file'}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          if (event.currentTarget.files) {
                            this.props.customerImportStore!.verifyImportFile(
                              event.currentTarget.files[0],
                              event.currentTarget.files[0].name
                            );
                          }
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
                        disabled={
                          customerImportStore!.customersToImport!.length <= 0 ||
                          customerImportStore!.customersToImport!.filter((e: NonPersistedImportCustomer) => e.invalid).length > 0
                        }
                        type={'submit'}
                      >
                        Import starten
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              )}
            />
          </DimePaper>
        </Grid>

        {customerImportStore!.importIsLoading && <LoadingSpinner />}
        {!customerImportStore!.importIsLoading &&
          customerImportStore!.customersToImport!.map((nonPersistedCustomer, index: number) => (
            <Grid item xs={12} md={4} key={index}>
              <CustomerImportPreviewCard customerPreview={nonPersistedCustomer} index={index} removeItem={this.removeCustomer} />
            </Grid>
          ))}
      </>
    );
  }
}
